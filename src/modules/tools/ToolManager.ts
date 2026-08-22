import type Application from "../editor/Application";
import type { ITool, Tools, ToolType } from "./types";
import { PointerEventType } from "../editor/controllers/InputController";
import { PenTool, EraserTool, BucketTool, EyeDropperTool } from "./index";

export default class ToolManager {
  private currentTool: ToolType = "pen";
  private previousTool: ToolType = this.currentTool;

  tools: Tools;

  constructor(private app: Application) {
    this.tools = {
      pen: new PenTool(),
      eraser: new EraserTool(),
      bucket: new BucketTool(),
      eyedropper: new EyeDropperTool()
    };
  }

  setActiveTool(type: ToolType) {
    if (!Object.prototype.hasOwnProperty.call(this.tools, type))
      console.warn(`No tool with name "${type}" was found.`);

    if (this.currentTool === type) return;

    if (this.currentTool !== "eyedropper") {
      this.previousTool = this.currentTool;
    }

    this.currentTool = type;
  }

  trySwitchToPrevTool() {
    if (!this.previousTool || this.previousTool === this.currentTool) return;

    this.app.setTool(this.previousTool);
  }

  getActiveTool(): ITool {
    return this.tools[this.currentTool];
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

    tool[methodName]?.(coords, context);
  }
}