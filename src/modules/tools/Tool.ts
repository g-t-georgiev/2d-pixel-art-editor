import type { color } from "../types";
import type { ITool } from "./types";
import PixelDocument from "../editor/core/PixelDocument";

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