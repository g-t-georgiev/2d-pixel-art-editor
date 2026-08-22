import type { ToolContext } from "./types";
import Tool from "./Tool";
import MathUtils from "../utils/MathUtils";

export default class PenTool extends Tool {
  private lastCoords: { x: number; y: number; } | null = null;

  constructor(name = "pen") {
    super(name);
  }

  onMouseDown(coords: { x: number; y: number; }, context: ToolContext) {
    this.lastCoords = coords;
    this.drawPoint(coords, context);
  }

  onMouseMove(coords: { x: number; y: number; }, context: ToolContext) {
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

  private drawPoint(
    { x, y }: { x: number; y: number; },
    { document, color, size }: ToolContext
  ) {
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