import type PixelDocument from "../../editor/core/PixelDocument";

export default abstract class Command {
  constructor(
    readonly document: PixelDocument,
    readonly layerId: string
  ) { }

  abstract execute(): void;

  abstract undo(): void;
}