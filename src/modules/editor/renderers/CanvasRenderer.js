import BackgroundRenderer from "./BackgroundRenderer.js";
import DocumentRenderer from "./DocumentRenderer.js";
import GridOverlayRenderer from "./GridOverlayRenderer.js";
import RulersOverlayRenderer from "./RulersOverlayRenderer.js";
import CursorOverlayRenderer from "./CursorOverlayRenderer.js";

/** @typedef {import("../Application.js").default} Application */
/** @typedef {import("../Camera.js").default} Camera */

export default class CanvasRenderer {
  /**
   * @param {Application} app
   * @param {HTMLCanvasElement} canvas 
   * @param {Camera} camera 
   * @param {number} rulerSize 
   */
  constructor(app, canvas, camera, rulerSize = 24) {
    /** @type Application */
    this.app = app;
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    /** @type Camera */
    this.camera = camera;

    // Sub-renderers
    this.backgroundRenderer = new BackgroundRenderer(this.context);
    this.docRenderer = new DocumentRenderer(this.context, camera);
    this.gridRenderer = new GridOverlayRenderer(this.context, camera);
    this.rulerRenderer = new RulersOverlayRenderer(this.context, camera, rulerSize);
    this.cursorRenderer = new CursorOverlayRenderer(this.context, camera);
  }

  get showGrid() {
    return this.gridRenderer.showGrid;
  }

  set showGrid(value) {
    this.gridRenderer.showGrid = value;
  }

  /** @param {{ x: number; y: number; }} mouseScreenPos */
  render(mouseScreenPos = { x: -1, y: -1 }) {
    const DPR = this.app.devicePixelRatio;
    const { document, isDrawing, tools, penSize, currentColor } = this.app;

    // Disable pixel smoothing for crisp pixel art rendering
    this.context.imageSmoothingEnabled = false;

    // Clear workspace buffer in raw pixels
    this.context.fillStyle = "#33353d";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    // Scale everything below to CSS pixel units
    this.context.scale(DPR, DPR);

    // World Space Pass
    this.context.save();
    this.context.translate(this.camera.x, this.camera.y);
    this.context.scale(this.camera.zoom, this.camera.zoom);

    this.backgroundRenderer.render(this.app.document.width, this.app.document.height);
    this.docRenderer.render(this.app.document);
    this.gridRenderer.render(this.app.document);

    if (!isDrawing) {
      // Render Hover Preview overlay (calculates grid coordinates from screen position)
      const rect = this.canvas.getBoundingClientRect();
      const { worldX, worldY } = this.camera.screenToWorld(
        mouseScreenPos.x + rect.left,
        mouseScreenPos.y + rect.top,
        rect
      );
      const gridCoords = this.camera.worldToGrid(worldX, worldY);
      const activeToolName = tools.getActiveTool()?.name;
      this.cursorRenderer.render(document, gridCoords, activeToolName, penSize, currentColor);
    }

    this.context.restore(); // Exit camera space, back to CSS screen space

    // UI Overlays
    this.rulerRenderer.render(
      this.app.canvasWidthInCSSPixels,
      this.app.canvasHeightInCSSPixels,
      mouseScreenPos
    );

    this.context.restore(); // Exit DPR scaling space
  }
}