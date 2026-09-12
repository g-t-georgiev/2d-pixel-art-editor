import type { Position } from "@modules/types";
import type Application from "@modules/editor/Application";
import type { ITool, ToolContext, Tools } from "@modules/tools/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";
import type HistoryManager from "@modules/history/HistoryManager";
import { PointerEventType } from "@modules/editor/controllers/InputController";
import { PenTool, EraserTool, BucketTool, EyeDropperTool } from "@modules/tools/toolsExport";
import { ApplicationStateActions, applicationStore } from "@modules/store";

export default class ToolManager {
  tools: Tools;

  constructor(
    private app: Application,
    private doc: PixelDocument,
    private history: HistoryManager
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
    coords: Position
  ) {
    const layer = this.doc.getActiveLayer();

    if (!layer?.visible) return;

    const tool = this.getActiveTool();

    if (!tool) return;

    const { penSize, currentColor } = applicationStore.getState();
    const colotToUse = tool.name === "eraser" ? null : currentColor;

    // Create a standardized payload containing only what tools need to operate
    const context: ToolContext = {
      doc: this.doc,
      history: this.history,
      color: colotToUse,
      size: penSize,
      isDrawing: this.app.isDrawing
    };

    const actionLabel = (action[0].toUpperCase() + action.slice(1)) as Capitalize<typeof action>;
    const methodName = `onMouse${actionLabel}` as const;

    tool[methodName]?.(coords, context);
  }
}