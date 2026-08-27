import type { ApplicationState, ApplicationStateActionsMap } from "./types";
import { Store } from "schema-store";
import {
  setToolAction,
  setColorAction,
  setPenSizeAction,
  gridToggleAction,
  documetnResizeAction,
} from "./actions";

const initialState: ApplicationState = {
  currentColor: "#ffff00",
  currentTool: "pen",
  previousTool: "pen",
  penSize: 1,
  camera: {
    zoom: 1,
    position: { x: 0, y: 0 },
  },
  document: {
    size: { width: 16, height: 16 }
  },
  preferences: {
    grid: { enabled: true }
  }
};

export const applicationStore = new Store<ApplicationState, ApplicationStateActionsMap>({
  initialState,
  actions: [
    setToolAction,
    setColorAction,
    setPenSizeAction,
    gridToggleAction,
    documetnResizeAction
  ],
});

export * from "./types";