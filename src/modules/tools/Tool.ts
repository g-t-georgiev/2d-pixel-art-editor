import type { color } from "../types";
import PixelDocument from "../editor/core/PixelDocument";

export type ToolContext = {
  document: PixelDocument;
  color: color;
  size: number;
  isDrawing: boolean;
};

export interface ITool {
  name: string;
  onMouseDown(coords: { x: number; y: number; }, context: ToolContext): void;
  onMouseMove?(coords: { x: number; y: number; }, context: ToolContext): void;
  onMouseUp?(coords: { x: number; y: number; }, context: ToolContext): void;
}

export default abstract class Tool implements ITool {
  constructor(readonly name: string) { }

  abstract onMouseDown(
    coords: { x: number; y: number; },
    context: {
      document: PixelDocument;
      color: color;
      size: number;
      isDrawing: boolean;
    }
  ): void;
}