export default class CursorOverlayRenderer {
  constructor(context, camera) {
    this.ctx = context;
    this.camera = camera;
  }

  render(document, gridCoords, activeToolName, penSize, currentColor) {
    // Only render hover inside bounds and when not actively panning
    if (
      !document.isWithinBounds(gridCoords.x, gridCoords.y) ||
      activeToolName === "pan" ||
      activeToolName === "eyedropper"
    ) return;

    this.ctx.save();

    const halfSize = Math.floor(penSize / 2);
    const startX = gridCoords.x - halfSize;
    const startY = gridCoords.y - halfSize;

    // 1. Draw Faded Brush Preview Fill
    if (activeToolName === "eraser") {
      this.ctx.fillStyle = "rgba(255, 100, 100, 0.35)";
    } else {
      // Use current active color with transparency
      this.ctx.fillStyle = currentColor ? `${currentColor}66` : "rgba(255, 255, 255, 0.35)";
    }

    this.ctx.fillRect(startX, startY, penSize, penSize);

    // 2. Draw Sharp Outline Around the Span Area
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 1 / this.camera.zoom;
    this.ctx.strokeRect(startX, startY, penSize, penSize);

    this.ctx.restore();
  }
}