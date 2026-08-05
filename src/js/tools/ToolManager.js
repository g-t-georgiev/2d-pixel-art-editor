import { PenTool, EraserTool, BucketTool, EyedropperTool } from "./index.js";

/** @typedef {import("../editor/PixelEditor.js").default} Editor */

/**
 * @typedef {object} Tools
 * @property {PenTool} pen
 * @property {EraserTool} eraser
 * @property {BucketTool} bucket
 * @property {EyedropperTool} eyedropper 
 */

/** @typedef {keyof Tools} ToolType */

export default class ToolManager {
  /** 
   * @private
   * @type ToolType
   */
  activeTool = "pen";
  /**
   * @private
   * @type ToolType
   */
  previousTool = this.activeTool;

  /**
   * @param {Editor} editor 
   */
  constructor(editor) {
    /** @type Editor */
    this.editor = editor;
    /** @type Tools */
    this.tools = {
      pen: new PenTool(),
      eraser: new EraserTool(),
      bucket: new BucketTool(),
      eyedropper: new EyedropperTool()
    };
  }

  /**
   * @param {ToolType} name
   */
  setActiveTool(name) {
    if (!Object.prototype.hasOwnProperty.call(this.tools, name))
      console.warn(`No tool with name "${name}" was found.`);

    if (this.activeTool === name) return;

    if (this.activeTool !== "eyedropper") {
      this.previousTool = this.activeTool;
    }

    this.activeTool = name;
  }

  trySwitchToPrevTool() {
    if (!this.previousTool || this.previousTool === this.activeTool) return;

    this.editor.setTool(this.previousTool);
  }

  getActiveTool() {
    return this.tools[this.activeTool];
  }
}