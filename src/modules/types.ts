export type color = string | null;

export enum ApplicationEventTypes {
  PickColor = "eyedropper:color:picked",
  // Declare event types here...
};

export type ApplicationEventsMap = {
  [ApplicationEventTypes.PickColor]: (payload: { color: color; trySwitchTool: boolean }) => void;
  // Declare callback shapes for events...
};