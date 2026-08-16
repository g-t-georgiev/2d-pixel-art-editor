import type Camera from "../Camera";
import type PixelDocument from "../core/PixelDocument";

export default class CursorOverlayRenderer {
  constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera
  ) { }

  render(
    document: PixelDocument,
    gridCoords: { x: number; y: number; },
    activeToolName: string,
    penSize: number,
    currentColor: string | null
  ) {
    // Only render hover inside bounds and when not actively panning
    if (
      !document.isWithinBounds(gridCoords.x, gridCoords.y) ||
      activeToolName === "pan" ||
      activeToolName === "eyedropper"
    ) return;

    this.context.save();

    const halfSize = Math.floor(penSize / 2);
    const startX = gridCoords.x - halfSize;
    const startY = gridCoords.y - halfSize;

    // 1. Draw Faded Brush Preview Fill
    if (activeToolName === "eraser") {
      this.context.fillStyle = "rgba(255, 100, 100, 0.35)";
    } else {
      // Use current active color with transparency
      this.context.fillStyle = currentColor ? `${currentColor}66` : "rgba(255, 255, 255, 0.35)";
    }

    this.context.fillRect(startX, startY, penSize, penSize);

    // Draw Sharp Outline Around the Span Area
    this.context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.context.lineWidth = 1 / this.camera.zoom;
    this.context.strokeRect(startX, startY, penSize, penSize);

    this.context.restore();
  }
}