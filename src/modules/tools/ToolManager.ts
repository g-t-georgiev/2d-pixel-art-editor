import type Application from "../editor/Application";
import type { ITool, Tools } from "./types";
import type PixelDocument from "../editor/core/PixelDocument";
import { PointerEventType } from "../editor/controllers/InputController";
import { PenTool, EraserTool, BucketTool, EyeDropperTool } from "./index";
import { ApplicationStateActions, applicationStore } from "../store";

export default class ToolManager {
  tools: Tools;

  constructor(
    private app: Application,
    private document: PixelDocument
  ) {
    this.tools = {
      pen: new PenTool(),
      eraser: new EraserTool(),
      bucket: new BucketTool(),
      eyedropper: new EyeDropperTool()
    };
  }

  trySwitchToPrevTool() {
    const { currentTool, previousTool } = applicationStore.getState();

    if (!previousTool || previousTool === currentTool) return;

    applicationStore.dispatch(ApplicationStateActions.SetTool, previousTool);
  }

  getActiveTool(): ITool {
    const { currentTool } = applicationStore.getState();

    return this.tools[currentTool];
  }

  /** Evaluates the active tool and passes a strictly defined context. */
  applyActiveTool(
    action: PointerEventType = PointerEventType.Down,
    coords: { x: number; y: number; }
  ) {
    const tool = this.getActiveTool();

    if (!tool) return;

    const { penSize, currentColor } = applicationStore.getState();

    // Create a standardized payload containing only what tools need to operate
    const context = {
      document: this.document,
      color: currentColor,
      size: penSize,
      isDrawing: this.app.isDrawing
    };

    const actionLabel = (action[0].toUpperCase() + action.slice(1)) as Capitalize<typeof action>;
    const methodName = `onMouse${actionLabel}` as const;

    tool[methodName]?.(coords, context);
  }
}