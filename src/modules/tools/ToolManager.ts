import type Application from "../editor/Application";
import { PointerEventType } from "../editor/controllers/InputController";
import { PenTool, EraserTool, BucketTool, EyedropperTool } from "./index";

export type Tools = {
  pen: PenTool;
  eraser: EraserTool;
  bucket: BucketTool;
  eyedropper: EyedropperTool;
}

export type ToolType = keyof Tools;


export default class ToolManager {
  private activeTool: ToolType = "pen";
  private previousTool: ToolType = this.activeTool;

  tools: Tools;

  constructor(private app: Application) {
    this.tools = {
      pen: new PenTool(),
      eraser: new EraserTool(),
      bucket: new BucketTool(),
      eyedropper: new EyedropperTool()
    };
  }

  setActiveTool(type: ToolType) {
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

  /** Evaluates the active tool and passes a strictly defined context. */
  applyActiveTool(
    action: PointerEventType = PointerEventType.Down,
    coords: { x: number; y: number; }
  ) {
    const tool = this.getActiveTool();

    if (!tool) return;

    // Create a standardized payload containing only what tools need to operate
    const context = {
      document: this.app.document,
      color: this.app.currentColor,
      size: this.app.penSize,
      isDrawing: this.app.isDrawing
    };

    const actionLabel = (action[0].toUpperCase() + action.slice(1)) as Capitalize<typeof action>;
    const methodName = `onMouse${actionLabel}` as const;

    if (typeof tool[methodName] === "function") {
      tool[methodName](coords, context);
    }
  }
}