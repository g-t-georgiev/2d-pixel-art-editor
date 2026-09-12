import type { PixelChange } from "@modules/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";
import Command from "@modules/history/commands/Command";

export default class ClearCommand extends Command {
  constructor(
    doc: PixelDocument,
    protected readonly changes: [string, PixelChange[]][]
  ) {
    super(doc);
  }

  execute(): void {
    for (const [layerId, pixels] of this.changes) {
      for (const { x, y, newColor } of pixels) {
        this.doc.setPixelData(x, y, newColor, layerId);
      }
    }
  }

  undo(): void {
    for (const [layerId, pixels] of this.changes) {
      for (const { x, y, oldColor } of pixels) {
        this.doc.setPixelData(x, y, oldColor, layerId);
      }
    }
  }
}