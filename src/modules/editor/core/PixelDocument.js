import PixelDocumentLayer from "./PixelDocumentLayer.js";

export default class PixelDocument {
  constructor(width = 16, height = 16) {
    this.width = width;
    this.height = height;

    this.layers = [];
    this.activeLayerId = null;
    this.layerIdCounter = 0;

    // Initialize the default document state
    this.addLayer("Layer 1");
  }

  /**
   * Resizes the document and safely maps existing pixel data to the new grid dimensions.
   * @param {number} newWidth 
   * @param {number} newHeight 
   */
  resize(newWidth, newHeight) {
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

  /**
   * Clears pixel data. 
   * If a layerId is specified, clears only that layer. Otherwise, clears all layers.
   * @param {string|null} layerId 
   */
  clear(layerId = null) {
    if (layerId) {
      const layer = this.getLayer(layerId);
      layer?.clear();
    } else {
      this.layers.forEach(layer => layer?.clear());
    }
  }

  addLayer(name) {
    const layer = new PixelDocumentLayer(`layer_${++this.layerIdCounter}`, name, this.width, this.height);
    this.layers.push(layer);
    this.activeLayerId = layer.id;
    return layer;
  }

  moveLayer(startIndex, endIndex) {
    const [movedLayer] = this.layers.splice(startIndex, 1);
    this.layers.splice(endIndex, 0, movedLayer);
  }

  getActiveLayer() {
    return this.layers.find(l => l.id === this.activeLayerId) || this.layers[0];
  }

  isWithinBounds(x, y, layerId = this.activeLayerId) {
    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);
      return;
    }

    return layer.isWithinBounds(x, y);
  }

  getPixelData(x, y, layerId = this.activeLayerId) {
    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);
      return;
    }

    return layer.getPixelData(x, y);
  }

  setPixelData(x, y, color, layerId = this.activeLayerId) {
    const layer = this.getLayer(layerId);

    if (!layer) {
      console.warn(`No layer found with #ID ${layerId}`);
      return;
    }

    return layer.setPixelData(x, y, color);
  }

  getLayer(layerId) {
    return this.layers.find(l => l.id === layerId);
  }
}