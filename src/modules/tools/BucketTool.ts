import type { Position } from "@modules/types";
import type { ToolContext } from "@modules/tools/types";
import Tool from "@modules/tools/Tool";
import FloodFill from "@modules/algorithms/FloodFill";
import { DrawCommand } from "@modules/history";

export default class BucketTool extends Tool {
  constructor() {
    super("bucket");
  }

  onMouseDown({ x, y }: Position, { document, history, color }: ToolContext) {
    const changes = FloodFill.execute(document, x, y, color);

    if (!changes.length || !document.activeLayerId) return;

    history.record(new DrawCommand(document, document.activeLayerId, changes));
  }
}