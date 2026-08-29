import type { Color, Position } from "@modules/types";
import type { PenTool, EraserTool, BucketTool, EyeDropperTool } from "@modules/tools/toolsExport";
import type PixelDocument from "@modules/editor/core/PixelDocument";
import type HistoryManager from "@modules/history/HistoryManager";

export interface ITool {
  name: string;
  onMouseDown(coords: Position, context: ToolContext): void;
  onMouseMove?(coords: Position, context: ToolContext): void;
  onMouseUp?(coords: Position, context: ToolContext): void;
}

export type ToolContext = {
  document: PixelDocument;
  history: HistoryManager;
  color: Color;
  size: number;
  isDrawing: boolean;
};

export type Tools = {
  pen: PenTool;
  eraser: EraserTool;
  bucket: BucketTool;
  eyedropper: EyeDropperTool;
}

export type ToolType = keyof Tools;