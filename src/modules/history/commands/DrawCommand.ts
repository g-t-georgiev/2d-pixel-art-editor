import type PixelDocument from "../../editor/core/PixelDocument";
import Command from "./Command";
export default class DrawCommand extends Command {
  constructor(
    document: PixelDocument,
    layerId: string,
    readonly pixels: Array<{ x: number; y: number; oldColor: string; newColor: string; }>
  ) {
    super(document, layerId);
  }

  execute() {
    this.pixels.forEach((p) => this.document.setPixelData(p.x, p.y, p.newColor, this.layerId));
  }

  undo() {
    this.pixels.forEach((p) => this.document.setPixelData(p.x, p.y, p.oldColor, this.layerId));
  }
}