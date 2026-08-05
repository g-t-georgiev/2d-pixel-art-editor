import BackgroundRenderer from "./BackgroundRenderer.js";
import DocumentRenderer from "./DocumentRenderer.js";
import GridOverlayRenderer from "./GridOverlayRenderer.js";
import RulersOverlayRenderer from "./RulersOverlayRenderer.js";
import CursorOverlayRenderer from "./CursorOverlayRenderer.js";

/** @typedef {import("../PixelEditor.js").default} Editor */
/** @typedef {import("../PixelDocument.js").default} Document */
/** @typedef {import("../Camera.js").default} Camera */

export default class CanvasRenderer {
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {Camera} camera 
   * @param {number} rulerSize 
   */
  constructor(canvas, camera, rulerSize = 24) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
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

  /**
   * @param {Editor} editor
   * @param {Document} document
   * @param {{ x: number; y: number; }} mouseScreenPos
   */
  render(editor, mouseScreenPos = { x: -1, y: -1 }) {
    const { document } = editor;

    // Disable pixel smoothing for crisp pixel art rendering
    this.context.imageSmoothingEnabled = false;

    // Clear Workspace
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "#33353d";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // World Space Pass
    this.context.save();
    this.context.translate(this.camera.x, this.camera.y);
    this.context.scale(this.camera.zoom, this.camera.zoom);

    this.backgroundRenderer.render(document.width, document.height);
    this.docRenderer.render(document);
    this.gridRenderer.render(document);

    if (!editor.isDrawing) {
      // Render Hover Preview overlay (calculates grid coordinates from screen position)
      const rect = this.canvas.getBoundingClientRect();
      const { worldX, worldY } = this.camera.screenToWorld(mouseScreenPos.x + rect.left, mouseScreenPos.y + rect.top, rect);
      const gridCoords = this.camera.worldToGrid(worldX, worldY);

      this.cursorRenderer.render(
        editor.document,
        gridCoords,
        editor.activeToolName,
        editor.penSize,
        editor.currentColor
      );
    }

    this.context.restore();

    // Screen Space Pass (Rulers, Guides)
    this.rulerRenderer.render(this.canvas.width, this.canvas.height, mouseScreenPos);
  }
}