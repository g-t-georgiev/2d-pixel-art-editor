import { PenTool, EraserTool, BucketTool, EyedropperTool } from "./index.js";

/** @typedef {import("../editor/Application.js").default} Application */

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
   * @param {Application} app 
   */
  constructor(app) {
    /** @type Application */
    this.app = app;
    /** @type Tools */
    this.tools = {
      pen: new PenTool(),
      eraser: new EraserTool(),
      bucket: new BucketTool(),
      eyedropper: new EyedropperTool()
    };
  }

  /** @param {ToolType} type */
  setActiveTool(type) {
    if (!Object.prototype.hasOwnProperty.call(this.tools, type))
      console.warn(`No tool with name "${type}" was found.`);

    if (this.activeTool === type) return;

    if (this.activeTool !== "eyedropper") {
      this.previousTool = this.activeTool;
    }

    this.activeTool = type;
  }

  trySwitchToPrevTool() {
    if (!this.previousTool || this.previousTool === this.activeTool) return;

    this.app.setTool(this.previousTool);
  }

  getActiveTool() {
    return this.tools[this.activeTool];
  }

  /**
     * Evaluates the active tool and passes a strictly defined context.
     * @param {"down" | "up" | "move"} action
     * @param {{x: number, y: number}} coords
     */
  applyActiveTool(action = "down", coords) {
    const tool = this.getActiveTool();
    if (!tool) return;

    // Create a standardized payload containing only what tools need to operate
    const context = {
      document: this.app.document,
      color: this.app.currentColor,
      size: this.app.penSize,
      isDrawing: this.app.isDrawing
    };

    const methodName = `onMouse${action[0].toUpperCase() + action.slice(1)}`;

    if (typeof tool[methodName] === "function") {
      tool[methodName](coords, context);
    }
  }
}