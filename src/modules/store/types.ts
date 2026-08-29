import type { Color, Position } from "@modules/types";
import type { ToolType } from "@modules/tools";

export enum ApplicationStateActions {
  SetTool = "store:tool:set",
  SetColor = "store:color:set",
  EditPen = "store:pen:edit",
  ToggleGrid = "store:grid:toggle",
  ResizeDocument = "store:document:resize",
};

export type ApplicationStateActionsMap = {
  [ApplicationStateActions.SetTool]: ToolType;
  [ApplicationStateActions.SetColor]: { color: Color, updateUi: boolean };
  [ApplicationStateActions.EditPen]: { size: number };
  [ApplicationStateActions.ToggleGrid]: { enabled: boolean };
  [ApplicationStateActions.ResizeDocument]: { width: number; height: number };
};

export interface ApplicationState {
  currentColor: Color;
  currentTool: ToolType;
  previousTool: ToolType,
  penSize: number;
  camera: {
    zoom: number;
    position: Position;
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