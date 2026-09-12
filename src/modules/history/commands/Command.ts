import type { ICommand } from "@modules/history/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";

export default abstract class Command implements ICommand {
  constructor(
    protected readonly doc: PixelDocument
  ) { }

  abstract execute(): void;

  abstract undo(): void;
}