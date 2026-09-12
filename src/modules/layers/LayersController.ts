import type PixelDocument from "@modules/editor/core/PixelDocument";
import { LayerEvents, type LayersManager } from "@modules/layers";

export default class LayersController {
  private manager: LayersManager;
  private abortController!: AbortController;

  constructor(managerParent: HTMLElement, private doc: PixelDocument) {
    const manager =
      document.querySelector("layer-manager") ||
      document.createElement("layer-manager");

    if (!manager.isConnected) managerParent.append(manager);

    this.manager = manager;

    this.attachEventListeners();
  }

  toggleActive(id: string) {
    if (!this.doc.getLayer(id)) return;

    this.doc.activeLayerId = id;
  }

  toggleVisibility(id: string, visible: boolean) {
    const layer = this.doc.getLayer(id);

    if (!layer || layer.visible === visible) return;

    layer.visible = visible;
  }

  toggleOrder(layerIds: string[]) {
    this.doc.layers.sort((a, b) => {
      const aIndex = layerIds.indexOf(a.id);
      const bIndex = layerIds.indexOf(b.id);
      return aIndex - bIndex;
    });
  }

  addNewLayer({
    name,
    active = false,
    visible = true,
  }: {
    name?: string
    active?: boolean;
    visible?: boolean;
  } = {}) {
    const layer = this.doc.addLayer({ name, active, visible });
    this.manager?.addNewLayer({ id: layer.id, name: layer.name, active, visible });
  }

  attachEventListeners() {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    this.manager.addEventListener(LayerEvents.Selected, (ev) => {
      this.toggleActive(ev.detail.id);
    }, { signal });

    this.manager.addEventListener(LayerEvents.Reorder, () => {
      const items = Array.from(this.manager.querySelectorAll("layer-item"));

      const reorderedIds = items
        .map((item) => item.uuid)
        .filter((id): id is string => !!id);

      this.toggleOrder(reorderedIds);
    }, { signal });

    this.manager.addEventListener(LayerEvents.VisibilityChange, (ev) => {
      const { id, visible } = ev.detail;
      console.log(id, visible);
      this.toggleVisibility(id, visible);
    }, { signal });
  }
}