import { ApplicationEventTypes, type Position } from "@modules/types";
import type { ToolContext } from "@modules/tools/types";
import Tool from "@modules/tools/Tool";
import { GlobalEmitter } from "@modules/utils/EventEmitter";

export default class EyeDropperTool extends Tool {
  constructor() {
    super("eyedropper");
  }

  onMouseDown({ x, y }: Position, { document }: ToolContext) {
    const color = document.getPixelData(x, y);
    GlobalEmitter.emit(ApplicationEventTypes.PickColor, { color, trySwitchTool: true });
  }
}