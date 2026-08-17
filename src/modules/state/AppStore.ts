import { Store, defineAction } from "schema-store";

// Define the TypeScript Interface
export interface AppState {
  activeTool: "pen" | "eraser" | "bucket" | "eyedropper";
  currentColor: string;
  penSize: number;
  zoom: number;
  gridSize: { width: number; height: number };
}

// Initial State
const initialState: AppState = {
  activeTool: "pen",
  currentColor: "#ffee00",
  penSize: 1,
  zoom: 1,
  gridSize: { width: 16, height: 16 }
};

// Define the Schema for changing tools (Must be `as const` for TS inference!)
const setToolSchema = {
  type: "object",
  properties: {
    tool: { type: "string", enum: ["pen", "eraser", "bucket", "eyedropper"] }
  },
  required: ["tool"],
  additionalProperties: false
} as const;

// Create the Action
const setToolAction = defineAction<AppState, "setTool", typeof setToolSchema>("setTool", {
  schema: setToolSchema,
  reducer: (state, payload) => {
    // Thanks to Immer, we can mutate safely!
    state.activeTool = payload.tool;
  }
});

// Instantiate and export the Singleton Store
export const appStore = new Store<AppState>({
  initialState,
  actions: [setToolAction] // Register your action here
});