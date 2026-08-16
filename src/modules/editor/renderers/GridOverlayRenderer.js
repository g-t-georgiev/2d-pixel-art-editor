export default class GridOverlayRenderer {
  constructor(context, camera) {
    this.ctx = context;
    this.camera = camera;
    this.showGrid = true;
  }

  render(document) {
    if (!this.showGrid || this.camera.zoom < 4) return;

    this.ctx.save();

    const zoom = this.camera.zoom;
    const halfPixelOffset = 0.5 / zoom;

    this.ctx.lineWidth = 1 / zoom;
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";

    this.ctx.beginPath();

    // Vertical column grid lines
    for (let col = 0; col <= document.width; col++) {
      const x = col + halfPixelOffset;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, document.height);
    }

    // Horizontal row grid lines
    for (let row = 0; row <= document.height; row++) {
      const y = row + halfPixelOffset;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(document.width, y);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }
}