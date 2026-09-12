import type Camera from "../Camera";
import type PixelDocument from "../core/PixelDocument";
import { applicationStore } from "../../store";

export default class GridOverlayRenderer {
  constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera
  ) { }

  render(doc: PixelDocument) {
    const { preferences: { grid } } = applicationStore.getState();

    if (!grid.enabled || this.camera.zoom < 4) return;

    this.context.save();

    const zoom = this.camera.zoom;
    const halfPixelOffset = 0.5 / zoom;

    this.context.lineWidth = 1 / zoom;
    this.context.strokeStyle = "rgba(255, 255, 255, 0.15)";

    this.context.beginPath();

    // Vertical column grid lines
    for (let col = 0; col <= doc.width; col++) {
      const x = col + halfPixelOffset;
      this.context.moveTo(x, 0);
      this.context.lineTo(x, doc.height);
    }

    // Horizontal row grid lines
    for (let row = 0; row <= doc.height; row++) {
      const y = row + halfPixelOffset;
      this.context.moveTo(0, y);
      this.context.lineTo(doc.width, y);
    }

    this.context.stroke();
    this.context.restore();
  }
}