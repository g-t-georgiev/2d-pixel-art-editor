import {
  LayerEvents as AllLayerEvents,
  type LayerEventPayloads as AllLayerEventPayloads,
  type LayerEventName as AllLayerEventName,
} from "./types";

import "./components/layer-item";
import LayerItem from "./components/layer-item";

import "./components/layers-manager";
import LayersManager, { type LayersManagerEventMap as LayersManagerAllEventMap } from "./components/layers-manager";

declare global {
  interface HTMLElementTagNameMap {
    "layer-manager": LayersManager;
    "layer-item": LayerItem;
  }
}

/* !!!IMPORTANT!!!
 * Exports listed below are public and modify some directory scoped types, such as
 * map objects, sets and enums, so that they reflect and dictate the public API shape and usage.
 *
 * Outer context should refrain from bypassing these and import directly from the modules instead.
 */
export type { LayerItem, LayersManager };

export type LayerEventName = Exclude<AllLayerEventName, "layer:select">;

export const LayerEvents = {
  Selected: AllLayerEvents.Selected,
  Reorder: AllLayerEvents.Reorder,
  VisibilityChange: AllLayerEvents.VisibilityChange,
} as const;

export type LayerEventPayloads = Pick<AllLayerEventPayloads, LayerEventName>;
export type LayerEventPayload<T extends LayerEventName> = LayerEventPayloads[T];

export type LayersManagerEventMap = LayersManagerAllEventMap<LayerEventName>;