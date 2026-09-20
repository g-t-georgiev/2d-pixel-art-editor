import type Camera from "@modules/Camera";
import type PixelDocument from "@modules/PixelDocument";
import PixelDocumentLayer from "@modules/PixelDocumentLayer";

export default class DocumentRenderer {
  constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera,
    private doc: PixelDocument
  ) { }

  render(isPreviewMode: boolean = false) {
    const { layers, width, height, alphaDimming } = this.doc;

    if (isPreviewMode) {
      this.renderComposite(this.context, layers);
    } else {
      const activeLayer = this.doc.getActiveLayer();
      this.renderFocusMode(this.context, layers, activeLayer, alphaDimming);
    }

    // Draw Workspace Canvas Border
    this.context.strokeStyle = "rgba(255, 255, 255, 0.15)";
    this.context.lineWidth = 2 / this.camera.zoom;
    this.context.strokeRect(0, 0, width, height);
  }

  private drawLayerGrid(context: CanvasRenderingContext2D, layer: PixelDocumentLayer) {
    const { width, height } = layer;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = layer.getPixelData(x, y);
        if (color === null) continue;

        context.fillStyle = color;
        context.fillRect(x, y, 1.01, 1.01);
      }
    }
  }

  /** Standard Z-index rendering for the final export/preview */
  private renderComposite(context: CanvasRenderingContext2D, layers: PixelDocumentLayer[]) {
    for (const layer of layers) {
      if (!layer.visible) continue;

      context.save();
      context.globalAlpha = layer.opacity;
      this.drawLayerGrid(context, layer);
      context.restore();
    }
  }

  /** Renders active layer on top of every other layer. */
  private renderFocusMode(
    context: CanvasRenderingContext2D,
    layers: PixelDocumentLayer[],
    activeLayer: PixelDocumentLayer,
    alphaDimming: number
  ) {
    const inactiveLayers = layers.filter((layer) => layer.id !== activeLayer.id && layer.visible);

    for (const layer of inactiveLayers) {
      context.save();
      context.globalAlpha = layer.opacity * alphaDimming;
      this.drawLayerGrid(context, layer);
      context.restore();
    }

    if (activeLayer && activeLayer.visible) {
      context.save();
      context.globalAlpha = activeLayer.opacity;
      this.drawLayerGrid(context, activeLayer);
      context.restore();
    }
  }
}