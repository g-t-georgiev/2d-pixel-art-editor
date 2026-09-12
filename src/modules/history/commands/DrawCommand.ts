import type { PixelChange } from "@modules/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";
import Command from "@modules/history/commands/Command";
export default class DrawCommand extends Command {
  constructor(
    doc: PixelDocument,
    protected readonly layerId: string,
    protected readonly pixels: Iterable<PixelChange>
  ) {
    super(doc);
  }

  execute(): void {
    for (const { x, y, newColor } of this.pixels) {
      this.doc.setPixelData(x, y, newColor, this.layerId);
    }
  }

  undo(): void {
    for (const { x, y, oldColor } of this.pixels) {
      this.doc.setPixelData(x, y, oldColor, this.layerId);
    }
  }
}