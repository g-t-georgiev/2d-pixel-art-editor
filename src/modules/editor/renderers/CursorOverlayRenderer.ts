import type { Color, Position } from "@modules/types";
import type Camera from "@modules/editor/Camera";
import type PixelDocument from "@modules/editor/core/PixelDocument";

export default class CursorOverlayRenderer {
  constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera
  ) { }

  render(
    document: PixelDocument,
    gridCoords: Position,
    activeToolName: string,
    penSize: number,
    currentColor: Color
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

    if (activeToolName === "eraser") {
      this.context.fillStyle = "rgba(255, 100, 100, 0.35)";
    } else {
      this.context.fillStyle = currentColor ? `${currentColor}66` : "rgba(255, 255, 255, 0.35)";
    }

    this.context.fillRect(startX, startY, penSize, penSize);

    this.context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.context.lineWidth = 1 / this.camera.zoom;
    this.context.strokeRect(startX, startY, penSize, penSize);

    this.context.restore();
  }
}