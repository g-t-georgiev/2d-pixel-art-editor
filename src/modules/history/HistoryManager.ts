import type Command from "./commands/Command";

export default class HistoryManager {
  private undoStack: Command[];
  private redoStack: Command[];

  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(command: Command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo on new action
  }

  undo() {
    if (this.undoStack.length === 0) return;

    const command = this.undoStack.pop()!;

    command.undo();
    this.redoStack.push(command);
  }

  redo() {
    if (this.redoStack.length === 0) return;

    const command = this.redoStack.pop()!;

    command.execute();
    this.undoStack.push(command);
  }
}