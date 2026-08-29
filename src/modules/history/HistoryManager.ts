import type { ICommand } from "@modules/history/types";

export default class HistoryManager {
  private undoStack: ICommand[];
  private redoStack: ICommand[];

  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  record(command: ICommand) {
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