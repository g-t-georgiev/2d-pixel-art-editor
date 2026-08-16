import PixelDocumentLayer from "./PixelDocumentLayer";

export default class PixelDocument {
  layers: PixelDocumentLayer[] = [];
  activeLayerId: string | null = null;
  layerIdCounter: number = 0;

  constructor(
    public width: number = 16,
    public height: number = 16
  ) {
    this.width = width;
    this.height = height;

    // Initialize the default document state
    this.addLayer("Layer 1");
  }

  /** Resizes the document and safely maps existing pixel data to the new grid dimensions. */
  resize(newWidth: number, newHeight: number) {
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = newWidth;
    this.height = newHeight;

    // Resize every layer's grid independently, preserving existing pixel data
    this.layers.forEach(layer => {
      const newGrid = new Array(newWidth * newHeight).fill(null);

      // Copy pixels from the old grid to the new grid (anchored top-left)
      for (let y = 0; y < Math.min(oldHeight, newHeight); y++) {
        for (let x = 0; x < Math.min(oldWidth, newWidth); x++) {
          newGrid[y * newWidth + x] = layer.grid[y * oldWidth + x];
        }
      }

      layer.width = newWidth;
      layer.height = newHeight;
      layer.grid = newGrid;
    });
  }

  /** Clears pixel data. If a layerId is specified, clears only that layer. Otherwise, clears all layers. */
  clear(layerId: string | null = null) {
    if (layerId) {
      const layer = this.getLayer(layerId);
      layer?.clear();
    } else {
      this.layers.forEach(layer => layer?.clear());
    }
  }

  addLayer(name: string) {
    const layer = new PixelDocumentLayer(`layer_${++this.layerIdCounter}`, name, this.width, this.height);
    this.layers.push(layer);
    this.activeLayerId = layer.id;
    return layer;
  }

  moveLayer(startIndex: number, endIndex: number) {
    const [movedLayer] = this.layers.splice(startIndex, 1);
    this.layers.splice(endIndex, 0, movedLayer);
  }

  getActiveLayer() {
    return this.layers.find(l => l.id === this.activeLayerId) || this.layers[0];
  }

  isWithinBounds(x: number, y: number, layerId = this.activeLayerId) {
    if (!layerId) return false;

    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);

      return false;
    }

    return layer.isWithinBounds(x, y);
  }

  getPixelData(x: number, y: number, layerId = this.activeLayerId) {
    if (!layerId) return null;

    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);
      return null;
    }

    return layer.getPixelData(x, y);
  }

  setPixelData(x: number, y: number, color: string | null, layerId = this.activeLayerId) {
    if (!layerId) return;

    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);
      return;
    }

    return layer.setPixelData(x, y, color);
  }

  getLayer(layerId: string) {
    return this.layers.find(l => l.id === layerId);
  }
}