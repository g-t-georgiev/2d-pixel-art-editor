import type { color } from "../types";
import type { PenTool, EraserTool, BucketTool, EyeDropperTool } from "./index";
import type PixelDocument from "../editor/core/PixelDocument";

export interface ITool {
  name: string;
  onMouseDown(coords: { x: number; y: number; }, context: ToolContext): void;
  onMouseMove?(coords: { x: number; y: number; }, context: ToolContext): void;
  onMouseUp?(coords: { x: number; y: number; }, context: ToolContext): void;
}

export type ToolContext = {
  document: PixelDocument;
  color: color;
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