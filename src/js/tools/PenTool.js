import Tool from "./Tool.js";
import MathUtils from "../utils/MathUtils.js";

export default class PenTool extends Tool {
  constructor() {
    super("pen");
    this.lastCoords = null;
  }

  onMouseDown(coords, editor) {
    this.lastCoords = coords;
    this.draw(coords, editor);
  }

  onMouseMove(coords, editor) {
    if (!editor.isDrawing) return;

    if (this.lastCoords) {
      // Interpolate line between last position and current position
      const points = MathUtils.bresenhamLine(
        this.lastCoords.x,
        this.lastCoords.y,
        coords.x,
        coords.y
      );

      points.forEach((pt) => this.drawPoint(pt, editor));
    } else {
      this.drawPoint(coords, editor);
    }

    this.lastCoords = coords;
  }

  onMouseUp() {
    this.lastCoords = null;
  }

  draw({ x, y }, editor) {
    const size = editor.penSize;
    const halfSize = Math.floor(size / 2);

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = x - halfSize + dx;
        const py = y - halfSize + dy;

        editor.document.setPixel(px, py, editor.currentColor);
      }
    }
  }

  drawPoint({ x, y }, editor) {
    const size = editor.penSize;
    const halfSize = Math.floor(size / 2);
    const color = this.name === "eraser" ? null : editor.currentColor;

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = x - halfSize + dx;
        const py = y - halfSize + dy;
        editor.document.setPixel(px, py, color);
      }
    }
  }
}