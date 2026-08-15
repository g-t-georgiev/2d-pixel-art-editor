import Tool from "./Tool.js";
import FloodFill from "../algorithms/FloodFill.js";

export default class BucketTool extends Tool {
  constructor() {
    super("bucket");
  }

  onMouseDown({ x, y }, { document, color }) {
    FloodFill.execute(document, x, y, color);
  }
}