export type Color = string | null;
export type Position = { x: number; y: number; };
export type PixelChange = Position & {
  oldColor: Color;
  newColor: Color;
};
export type Dimensions = { width: number; height: number; };
export type ResizeData = { oldSize: Dimensions; newSize: Dimensions; };

export type Template<T> = (props: T) => string;

export enum ApplicationEventTypes {
  PickColor = "eyedropper:color:picked",
  // Declare event types here...
};

export type ApplicationEventsMap = {
  [ApplicationEventTypes.PickColor]: (payload: { color: Color; trySwitchTool: boolean }) => void;
  // Declare callback shapes for events...
};

export interface WebComponent extends HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  adoptedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
};