import type { PixelChange, Position } from "@modules/types";
import type { ToolContext } from "@modules/tools/types";
import Tool from "@modules/tools/Tool";
import MathUtils from "@modules/utils/MathUtils";
import { DrawCommand } from "@modules/history/commands";

export default class PenTool extends Tool {
  private lastCoords: Position | null = null;
  private currentStroke: PixelChange[] = [];

  constructor(name = "pen") {
    super(name);
  }

  onMouseDown(coords: Position, context: ToolContext) {
    this.lastCoords = coords;
    this.currentStroke = [];

    this.drawPoint(coords, context);
  }

  onMouseMove(coords: Position, context: ToolContext) {
    if (!context.isDrawing) return;

    if (this.lastCoords) {
      const points = MathUtils.plotLine(
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

  onMouseUp(
    _coords: Position,
    { document, history }: ToolContext
  ) {
    this.lastCoords = null;

    if (this.currentStroke.length > 0 && document.activeLayerId) {
      history.record(new DrawCommand(document, document.activeLayerId, this.currentStroke));
    }

    this.currentStroke = [];
  }

  private drawPoint(
    { x, y }: Position,
    { document, color, size }: ToolContext
  ) {
    const halfSize = Math.floor(size / 2);

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = x - halfSize + dx;
        const py = y - halfSize + dy;

        if (!document.isWithinBounds(px, py)) continue;

        const oldColor = document.getPixelData(px, py);

        if (oldColor === color) continue;

        this.currentStroke.push({
          x: px,
          y: py,
          oldColor,
          newColor: color,
        });

        document.setPixelData(px, py, color);
      }
    }
  }
}