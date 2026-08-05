import Tool from "./Tool.js";
import { GlobalEmitter } from "../utils/EventEmitter.js";

/** @typedef {import("../editor/PixelEditor.js").default} Editor */

export default class EyedropperTool extends Tool {
  constructor() {
    super("eyedropper");
  }

  /**
   * 
   * @param {object} coords
   * @param {number} coords.x
   * @param {number} coords.y 
   * @param {Editor} editor 
   */
  onMouseDown({ x, y }, editor) {
    const color = editor.document.getPixel(x, y);

    if (!color) return;

    GlobalEmitter.emit("eyedropper:color:picked", { color, trySwitchTool: true });
  }
}