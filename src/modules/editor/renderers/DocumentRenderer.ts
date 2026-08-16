import type Camera from "../Camera";
import type PixelDocument from "../core/PixelDocument";

export default class DocumentRenderer {
  constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera
  ) { }

  render(document: PixelDocument) {
    // Render all visible layers from bottom to top
    for (const layer of document.layers) {
      if (!layer.visible) continue;

      for (let y = 0; y < document.height; y++) {
        for (let x = 0; x < document.width; x++) {
          const color = layer.getPixelData(x, y);

          if (color) {
            this.context.fillStyle = color;
            this.context.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    // Draw Workspace Canvas Border
    this.context.strokeStyle = "rgba(255, 255, 255, 0.15)";
    this.context.lineWidth = 2 / this.camera.zoom;
    this.context.strokeRect(0, 0, document.width, document.height);
  }
}