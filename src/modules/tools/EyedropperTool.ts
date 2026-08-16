import Tool, { type ToolContext } from "./Tool";
import { GlobalEmitter } from "../utils/EventEmitter";

export default class EyedropperTool extends Tool {
  constructor() {
    super("eyedropper");
  }

  onMouseDown({ x, y }: { x: number; y: number; }, { document }: ToolContext) {
    const color = document.getPixelData(x, y);

    if (!color) return;

    GlobalEmitter.emit("eyedropper:color:picked", { color, trySwitchTool: true });
  }
}