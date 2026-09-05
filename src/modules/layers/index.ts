import LayerItem from "./LayerItem";
import LayerManager from "./LayersManager";

declare global {
  interface HTMLElementTagNameMap {
    "layer-manager": LayerManager;
    "layer-item": LayerItem;
  }
}

export {
  LayerItem,
  LayerManager,
};