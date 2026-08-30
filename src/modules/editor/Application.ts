import { ApplicationEventTypes, type Position } from "@modules/types";
import { GlobalEmitter } from "@modules/utils/EventEmitter";
import PixelDocument from "@modules/editor/core/PixelDocument";
import Camera from "@modules/editor/Camera";
import CanvasRenderer from "@modules/editor/renderers/CanvasRenderer";
import InputController from "@modules/editor/controllers/InputController";
import UIManager from "@modules/editor/managers/UIManager";
import { ToolManager } from "@modules/tools";
import ExportsManager from "@modules/editor/managers/ExportsManager";
import { HistoryManager, ClearCommand, ResizeCommand } from "@modules/history";
import { ApplicationStateActions, applicationStore } from "@modules/store";

export default class Application {
  isDrawing = false;
  isPanning = false;
  isQuickColorPicking = false;

  readonly camera: Camera;
  readonly renderer: CanvasRenderer;
  readonly history: HistoryManager;
  readonly document: PixelDocument;
  readonly tools: ToolManager;
  readonly ui: UIManager;
  readonly input: InputController;
  readonly exports: ExportsManager;
  readonly events = GlobalEmitter;

  private canvasContainer: HTMLElement;

  constructor(public canvas: HTMLCanvasElement) {
    this.canvasContainer = canvas.parentElement!;

    this.camera = new Camera();
    this.document = new PixelDocument(16, 16);

    this.history = new HistoryManager();

    this.ui = new UIManager(this);
    this.tools = new ToolManager(this, this.document, this.history);

    this.renderer = new CanvasRenderer(
      this,
      this.document,
      this.tools,
      this.canvas,
      this.camera
    );

    this.input = new InputController(
      this,
      this.tools,
      this.camera,
      this.renderer,
      this.canvas,
      this.canvasContainer,
      this.history
    );

    this.exports = new ExportsManager();

    this.renderLoop = this.renderLoop.bind(this);

    this.attachCustomEventListeners();
    this.attachStateChangeListeners();
    this.setupResizeObserver();
    this.startLoop();
  }

  get devicePixelRatio() {
    return window.devicePixelRatio || 1;
  }

  get canvasWidthInCSSPixels() {
    return this.canvas.width / this.devicePixelRatio;
  }

  get canvasHeightInCSSPixels() {
    return this.canvas.height / this.devicePixelRatio;
  }

  attachCustomEventListeners() {
    this.events.on(ApplicationEventTypes.PickColor, ({ color, trySwitchTool }) => {
      applicationStore.dispatch(ApplicationStateActions.SetColor, { color, updateUi: true });

      if (!trySwitchTool) return;

      this.tools.trySwitchToPrevTool();
    });
  }

  attachStateChangeListeners() {
    applicationStore.select(
      (state) => state.document.size,
      ({ width, height }) => {
        this.document.resize(width, height);
        this.fitToView();
      }
    );
  }

  setupResizeObserver() {
    let isInitialRender = false;

    const observer = new ResizeObserver((entries) => {
      const DPR = this.devicePixelRatio;

      for (const entry of entries) {
        const cssWidth = entry.contentRect.width;
        const cssHeight = entry.contentRect.height;

        // Capture the center of the screen in World coordinates BEFORE resizing
        let focalWorldX = 0, focalWorldY = 0;
        if (isInitialRender) {
          const oldRect = this.canvas.getBoundingClientRect();
          const oldCenter = this.camera.screenToWorld(
            oldRect.left + (this.canvasWidthInCSSPixels / 2),
            oldRect.top + (this.canvasHeightInCSSPixels / 2),
            oldRect
          );
          focalWorldX = oldCenter.worldX;
          focalWorldY = oldCenter.worldY;
        }

        // Set actual render buffer size in HiDPI pixels
        this.canvas.width = cssWidth * DPR;
        this.canvas.height = cssHeight * DPR;

        if (!isInitialRender && cssWidth > 0 && cssHeight > 0) {
          this.fitToView();
          isInitialRender = true;
        } else {
          // Re-center the camera on the saved focal point using new dimensions
          this.camera.centerOnWorld(focalWorldX, focalWorldY, cssWidth, cssHeight);
          this.camera.clamp(cssWidth, cssHeight, this.document.width, this.document.height);
        }
      }
    });

    observer.observe(this.canvasContainer);
  }

  clearDocument() {
    const clearedLayers = this.document.clear();

    if (!clearedLayers.length) return;

    this.history.record(new ClearCommand(this.document, clearedLayers));
  }

  resizeDocument(width: number, height: number) {
    const oldSize = {
      width: this.document.width,
      height: this.document.height
    };

    if (oldSize.width === width && oldSize.height === height) return;

    const command = new ResizeCommand(
      applicationStore,
      { oldSize, newSize: { width, height }}
    );

    command.execute();
    this.history.record(command);
  }

  fitToView() {
    this.camera.fitToView(
      this.canvasWidthInCSSPixels,
      this.canvasHeightInCSSPixels,
      this.document.width,
      this.document.height
    );
  }

  zoomBy(factor: number) {
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + this.canvasWidthInCSSPixels / 2;
    const centerY = rect.top + this.canvasHeightInCSSPixels / 2;

    this.camera.calculateZoom(
      centerX,
      centerY,
      factor,
      rect,
      this.document.width,
      this.document.height
    );
  }

  updateCameraPos(dx?: number, dy?: number, clamp = true) {
    if (!dx && !dy) return;

    this.camera.moveBy(dx, dy);

    if (!clamp) return;

    this.camera.clamp(
      this.canvasWidthInCSSPixels,
      this.canvasHeightInCSSPixels,
      this.document.width,
      this.document.height
    );
  }

  updateCameraZoom(
    posX: number,
    posY: number,
    scrollY: number,
    clamp = true
  ) {
    const zoomFactor = scrollY < 0 ? 1.15 : 0.85;
    const rect = this.canvas.getBoundingClientRect();

    this.camera.calculateZoom(
      posX,
      posY,
      zoomFactor,
      rect,
      this.document.width,
      this.document.height
    );

    if (!clamp) return;

    this.camera.clamp(
      this.canvasWidthInCSSPixels,
      this.canvasHeightInCSSPixels,
      this.document.width,
      this.document.height
    );
  }

  updateCoordsDisplay(coords: Position) {
    if (!this.document.isWithinBounds(coords.x, coords.y)) return;

    this.ui.updateStatus(coords, this.camera.zoom);
  }

  exportPNG() {
    this.exports.exportPNG(this.document);
  }

  startLoop() {
    requestAnimationFrame(this.renderLoop);
  }

  renderLoop() {
    requestAnimationFrame(this.renderLoop);

    this.renderer.render(this.input.mouseScreenPos);
  }
}