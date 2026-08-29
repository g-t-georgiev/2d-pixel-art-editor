import type { ICommand } from "@modules/history/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";

export default abstract class Command implements ICommand {
  constructor(
    protected readonly document: PixelDocument
  ) { }

  abstract execute(): void;

  abstract undo(): void;
}