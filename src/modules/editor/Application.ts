import type { color } from "../types";
import { GlobalEmitter } from "../utils/EventEmitter";
import PixelDocument from "./core/PixelDocument";
import Camera from "./Camera";
import CanvasRenderer from "./renderers/CanvasRenderer";
import InputController, { PointerEventType } from "./controllers/InputController";
import UIManager from "./managers/UIManager";
import ToolManager, { ToolType } from "../tools/ToolManager";
import ExportsManager from "./managers/ExportsManager";

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
    this.ui = new UIManager(this);
    this.input = new InputController(this, this.canvas, this.canvasContainer);

    this.exports = new ExportsManager();

    this.renderLoop = this.renderLoop.bind(this);

    this.attachCustomEventListeners();
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
    this.events.on("eyedropper:color:picked", ({ color, trySwitchTool }) => {
      this.setColor(color);

      if (!trySwitchTool) return;

      this.tools.trySwitchToPrevTool();
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

  setColor(color: color) {
    this.currentColor = color;

    /**
     * Because "null" value represents empty/transparent color, but we can't pass null as a valid color
     * value for the color picker widget, we should convert it to a valid transparent CSS color.
     */
    const normalizedColor = color ?? "transparent"
    this.ui.updateColorUI(normalizedColor);
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