import { GlobalEmitter } from "../utils/EventEmitter.js";
import PixelDocument from "./core/PixelDocument.js";
import Camera from "./Camera.js";
import CanvasRenderer from "./renderers/CanvasRenderer.js";
import InputController from "./controllers/InputController.js";
import UIManager from "./managers/UIManager.js";
import ToolManager from "../tools/ToolManager.js";
import ExportsManager from "./managers/ExportsManager.js";
import ColorUtils from "../utils/ColorUtils.js";

export default class Application {
  /** @private */
  isDrawing = false;
  /** @private */
  isPanning = false;
  /** @private */
  isQuickColorPicking = false;

  penSize = 1;
  currentColor = "#ffee00";

  /** @readonly */
  events = GlobalEmitter;

  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.camera = new Camera();
    this.renderer = new CanvasRenderer(this, this.canvas, this.camera);
    this.document = new PixelDocument(16, 16);

    this.tools = new ToolManager(this);

    this.ui = new UIManager(this);
    this.input = new InputController(this, this.renderer.canvas, this.renderer.canvas.parentElement);

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

    observer.observe(this.canvas.parentElement);
  }

  /** @param {import("../tools/ToolManager.js").ToolType} name */
  setTool(name) {
    this.ui.setActiveTool(name);
    this.tools.setActiveTool(name);
  }

  /** @param {string} color */
  setColor(color) {
    this.ui.updateColorUI(color);
    this.currentColor = color;
  }

  useActiveTool(coords, action) {
    // Delegation: ToolManager figures out the arguments now
    this.tools.applyActiveTool(action, coords);
  }

  resizeDocument(width, height) {
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

  zoomBy(factor) {
    const rect = this.renderer.canvas.getBoundingClientRect();
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

  updateCoordsDisplay(coords) {
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