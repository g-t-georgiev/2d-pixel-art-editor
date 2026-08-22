import type { ToolContext } from "./types";
import Tool from "./Tool";
import { GlobalEmitter } from "../utils/EventEmitter";
import { ApplicationEventTypes } from "../types";

export default class EyeDropperTool extends Tool {
  constructor() {
    super("eyedropper");
  }

  onMouseDown({ x, y }: { x: number; y: number; }, { document }: ToolContext) {
    const color = document.getPixelData(x, y);
    GlobalEmitter.emit(ApplicationEventTypes.PickColor, { color, trySwitchTool: true });
  }
}