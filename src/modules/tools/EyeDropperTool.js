import Tool from "./Tool.js";
import { GlobalEmitter } from "../utils/EventEmitter.js";

export default class EyedropperTool extends Tool {
  constructor() {
    super("eyedropper");
  }

  onMouseDown({ x, y }, { document }) {
    const color = document.getPixelData(x, y);

    if (!color) return;

    GlobalEmitter.emit("eyedropper:color:picked", { color, trySwitchTool: true });
  }
}