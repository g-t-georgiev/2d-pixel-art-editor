import Tool, { type ToolContext } from "./Tool";
import FloodFill from "../algorithms/FloodFill";

export default class BucketTool extends Tool {
  constructor() {
    super("bucket");
  }

  onMouseDown({ x, y }: { x: number; y: number; }, { document, color }: ToolContext) {
    if (!color) return;

    FloodFill.execute(document, x, y, color);
  }
}