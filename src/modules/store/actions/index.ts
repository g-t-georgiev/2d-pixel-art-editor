import { defineAction } from "schema-store";
import { type ApplicationState, ApplicationStateActions } from "../types";
import {
  setToolSchema,
  setColorSchema,
  setPenSizeSchema,
  gridToggleSchema,
  documentResizeSchema,
} from "../schemas";

export const setToolAction = defineAction<
  ApplicationState,
  ApplicationStateActions.SetTool,
  typeof setToolSchema
>(ApplicationStateActions.SetTool, {
  schema: setToolSchema,
  reducer(state, payload) {
    const { currentTool } = state;

    if (payload === currentTool) return;

    state.currentTool = payload;

    if (currentTool === "eyedropper") return;

    state.previousTool = currentTool;
  }
});

export const setColorAction = defineAction<
  ApplicationState,
  ApplicationStateActions.SetColor,
  typeof setColorSchema
>(ApplicationStateActions.SetColor, {
  schema: setColorSchema,
  reducer(state, payload) {
    state.currentColor = payload.color;
  }
});

export const setPenSizeAction = defineAction<
  ApplicationState,
  ApplicationStateActions.EditPen,
  typeof setPenSizeSchema
>(ApplicationStateActions.EditPen, {
  schema: setPenSizeSchema,
  reducer(state, payload) {
    const { size } = payload;
    state.penSize = size;
  },
});

export const gridToggleAction = defineAction<
  ApplicationState,
  ApplicationStateActions.ToggleGrid,
  typeof gridToggleSchema
>(ApplicationStateActions.ToggleGrid, {
  schema: gridToggleSchema,
  reducer(state, payload) {
    const { enabled } = payload;
    state.preferences.grid.enabled = enabled;
  }
});

export const documetnResizeAction = defineAction<
  ApplicationState,
  ApplicationStateActions.ResizeDocument,
  typeof documentResizeSchema
>(ApplicationStateActions.ResizeDocument, {
  schema: documentResizeSchema,
  reducer(state, payload) {
    const { width, height } = payload;
    state.document.size.width = width;
    state.document.size.height = height;
  },
});