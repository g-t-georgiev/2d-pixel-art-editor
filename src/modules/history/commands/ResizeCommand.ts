import type { ResizeData } from "@modules/types";
import type { ICommand } from "@modules/history/types";
import { type ApplicationState, type ApplicationStateActionsMap, ApplicationStateActions } from "@modules/store";
import { Store } from "schema-store";

export default class ResizeCommand implements ICommand {
  constructor(
    protected readonly store: Store<ApplicationState, ApplicationStateActionsMap>,
    protected readonly data: ResizeData
  ) { }

  execute(): void {
    this.store.dispatch(ApplicationStateActions.ResizeDocument, this.data.newSize);
  }

  undo(): void {
    this.store.dispatch(ApplicationStateActions.ResizeDocument, this.data.oldSize);
  }
}