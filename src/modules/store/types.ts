import type { ToolType } from "../tools/types";
import type { color } from "../types";

export enum ApplicationStateActions {
  SetTool = "store:tool:set",
  SetColor = "store:color:set",
  EditPen = "store:pen:edit",
  ToggleGrid = "store:grid:toggle",
  ResizeDocument = "store:document:resize",
};

export type ApplicationStateActionsMap = {
  [ApplicationStateActions.SetTool]: ToolType;
  [ApplicationStateActions.SetColor]: { color: color, updateUi: boolean };
  [ApplicationStateActions.EditPen]: { size: number; };
  [ApplicationStateActions.ToggleGrid]: { enabled: boolean; };
  [ApplicationStateActions.ResizeDocument]: { width: number; height: number; };
};

export interface ApplicationState {
  currentColor: color;
  currentTool: ToolType;
  penSize: number;
  camera: {
    zoom: number;
    position: { x: number; y: number; };
  };
  document: {
    size: { width: number; height: number; };
  };
  preferences: {
    grid: {
      enabled: boolean;
    };
  };
}