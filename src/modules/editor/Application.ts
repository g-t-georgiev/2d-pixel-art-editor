import { ApplicationEventTypes, type color } from "../types";
import type { ToolType } from "../tools/types";
import { GlobalEmitter } from "../utils/EventEmitter";
import PixelDocument from "./core/PixelDocument";
import Camera from "./Camera";
import CanvasRenderer from "./renderers/CanvasRenderer";
import InputController, { PointerEventType } from "./controllers/InputController";
import UIManager from "./managers/UIManager";
import ToolManager from "../tools/ToolManager";
import ExportsManager from "./managers/ExportsManager";
import { ApplicationStateActions, applicationStore } from "../store";

export default class Application {
  penSize = 1;
  currentColor: color = "#ffee00";

  isDrawing = false;
  isPanning = false;
  isQuickColorPicking = false;

  readonly camera: Camera;
  readonly renderer: CanvasRenderer;
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
    this.renderer = new CanvasRenderer(this, this.canvas, this.camera);
    this.document = new PixelDocument(16, 16);

    this.tools = new ToolManager(this);
    this.ui = new UIManager(this, applicationStore);
    this.input = new InputController(this, this.canvas, this.canvasContainer);

    this.exports = new ExportsManager();

    this.renderLoop = this.renderLoop.bind(this);

    this.attachCustomEventListeners();
    this.attachStateSubscriptions();
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

  attachStateSubscriptions() {
    applicationStore.select(
      (state) => state.currentTool,
      (tool) => this.setTool(tool)
    );

    applicationStore.select(
      (state) => state.penSize,
      (size) => this.penSize = size
    );

    applicationStore.select(
      (state) => state.preferences.grid,
      (grid) => this.renderer.showGrid = grid.enabled
    );

    applicationStore.select(
      (state) => state.document.size,
      ({ width, height }) => this.resizeDocument(width, height)
    );

    applicationStore.on(ApplicationStateActions.SetColor, (event) => {
      const { color, updateUi } = event.payload;
      this.setColor(color, updateUi);
    });
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
          this.resetView();
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

  setTool(name: ToolType) {
    this.ui.setActiveTool(name);
    this.tools.setActiveTool(name);
  }

  setColor(color: color, updateUi: boolean) {
    this.currentColor = color;

    if (!updateUi) return;

    this.ui.updateColorUI(color);
  }

  useActiveTool(coords: { x: number; y: number; }, action: PointerEventType) {
    this.tools.applyActiveTool(action, coords);
  }

  resizeDocument(width: number, height: number) {
    this.document.resize(width, height);
    this.resetView();
  }

  clearDocument() {
    this.document.clear();
  }

  resetView() {
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

  updateCoordsDisplay(coords: { x: number; y: number; }) {
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