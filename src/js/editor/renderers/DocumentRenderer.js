export default class DocumentRenderer {
  constructor(context, camera) {
    this.ctx = context;
    this.camera = camera;
  }

  render(document) {
    // 1. Render ALL visible layers from bottom to top
    for (const layer of document.layers) {
      if (!layer.visible) continue;

      for (let y = 0; y < document.height; y++) {
        for (let x = 0; x < document.width; x++) {
          const color = layer.getPixelData(x, y, layer.id);

          if (color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    // 2. Draw Workspace Canvas Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    this.ctx.lineWidth = 2 / this.camera.zoom;
    this.ctx.strokeRect(0, 0, document.width, document.height);
  }
}