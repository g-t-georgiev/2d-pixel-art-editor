import type { Position } from "@modules/types";
import type { ToolContext } from "@modules/tools/types";
import Tool from "@modules/tools/Tool";
import FloodFill from "@modules/algorithms/FloodFill";
import { DrawCommand } from "@modules/history";

export default class BucketTool extends Tool {
  constructor() {
    super("bucket");
  }

  onMouseDown({ x, y }: Position, { doc, history, color }: ToolContext) {
    const changes = FloodFill.execute(doc, x, y, color);

    if (!changes.length || !doc.activeLayerId) return;

    history.record(new DrawCommand(doc, doc.activeLayerId, changes));
  }
}