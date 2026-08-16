import Tool from "./Tool.js";
import MathUtils from "../utils/MathUtils.js";

export default class PenTool extends Tool {
  constructor(name = "pen") {
    super(name);
    this.lastCoords = null;
  }

  onMouseDown(coords, context) {
    this.lastCoords = coords;
    this.drawPoint(coords, context);
  }

  onMouseMove(coords, context) {
    if (!context.isDrawing) return;

    if (this.lastCoords) {
      const points = MathUtils.bresenhamLine(
        this.lastCoords.x,
        this.lastCoords.y,
        coords.x,
        coords.y
      );

      points.forEach((pt) => this.drawPoint(pt, context));
    } else {
      this.drawPoint(coords, context);
    }

    this.lastCoords = coords;
  }

  onMouseUp() {
    this.lastCoords = null;
  }

  drawPoint({ x, y }, { document, color, size }) {
    const halfSize = Math.floor(size / 2);
    const activeColor = this.name === "eraser" ? null : color;

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = x - halfSize + dx;
        const py = y - halfSize + dy;
        document.setPixelData(px, py, activeColor);
      }
    }
  }
}