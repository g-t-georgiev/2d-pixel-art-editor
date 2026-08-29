import type { Position } from "@modules/types";
import type { ITool, ToolContext } from "@modules/tools/types";

export default abstract class Tool implements ITool {
  constructor(readonly name: string) { }

  abstract onMouseDown(
    coords: Position,
    context: ToolContext
  ): void;
}