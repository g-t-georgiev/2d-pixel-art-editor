import { GlobalEmitter } from "../utils/EventEmitter.js";
import PixelDocument from "./PixelDocument.js";
import Camera from "./Camera.js";
import CanvasRenderer from "./renderers/CanvasRenderer.js";
import InputController from "./InputController.js";
import UIController from "./UIController.js";
import ToolManager from "../tools/ToolManager.js";
import ColorUtils from "../utils/ColorUtils.js";
import ExportsManager from "./ExportsManager.js";

export default class PixelEditor {
  isDrawing = false;
  isPanning = false;
  isQuickColorPicking = false;

  penSize = 1;
  currentColor = "#ffee00";

  events = GlobalEmitter;

  constructor(canvasElement) {
    this.document = new PixelDocument(16, 16);
    this.camera = new Camera();
    this.renderer = new CanvasRenderer(canvasElement, this.camera);

    this.tools = new ToolManager(this);

    this.ui = new UIController(this);
    this.input = new InputController(this, this.renderer.canvas, this.renderer.canvas.parentElement);

    this.exports = new ExportsManager();

    this.attachCustomEventListeners();
    this.setupResizeObserver();
    this.startLoop();
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
      for (const entry of entries) {
        this.renderer.canvas.width = entry.contentRect.width;
        this.renderer.canvas.height = entry.contentRect.height;
      }

      if (!isInitialRender) {
        this.resetView();

        isInitialRender = true;
      }
    });
    observer.observe(this.renderer.canvas.parentElement);
  }

  /**
   * Update ToolsManager and UIController
   * @param {import("../tools/ToolManager.js").ToolType} name 
   */
  setTool(name) {
    this.ui.setActiveTool(name);
    this.tools.setActiveTool(name);
  }

  /** 
   * Update currentColor and UIController
   * @param {string} color
   */
  setColor(color) {
    this.ui.updateColorUI(color);
    this.currentColor = color;
  }

  useActiveTool(coords, action) {
    const tool = this.tools.getActiveTool();

    if (!tool) return;

    if (action === "down") tool.onMouseDown(coords, this);
    else if (action === "move") tool.onMouseMove(coords, this);
    else if (action === "up") tool.onMouseUp(coords, this);
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
      this.renderer.canvas.width,
      this.renderer.canvas.height,
      this.document.width,
      this.document.height
    );
  }

  zoomBy(factor) {
    const rect = this.renderer.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    this.camera.calculateZoom(centerX, centerY, factor, rect);
  }

  updateCoordsDisplay(coords) {
    this.ui.updateStatus(coords, this.camera.zoom);
  }

  exportPNG() {
    this.exports.exportPNG(this.document);
  }

  startLoop() {
    const render = () => {
      requestAnimationFrame(render);

      console.log()
      this.renderer.render(this, this.input.mouseScreenPos);
    };
    requestAnimationFrame(render);
  }
}