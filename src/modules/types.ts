export type color = string | null;

// Define your Event Map
// This acts as the single source of truth for all events and their payloads.
export type AppEvents = {
  "eyedropper:color:picked": (payload: { color: color; trySwitchTool: boolean }) => void;
  // Add other events here...
};