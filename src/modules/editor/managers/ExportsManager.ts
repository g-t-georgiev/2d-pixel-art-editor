import type PixelDocument from "../core/PixelDocument";
import ColorUtils from "../../utils/ColorUtils";

export default class ExportsManager {
  exportPNG(doc: PixelDocument) {
    const { canvas, context } = this.createOffscreenCanvas();

    canvas.width = doc.width;
    canvas.height = doc.height;

    const imgData = context.createImageData(doc.width, doc.height);

    for (let y = 0; y < doc.height; y++) {
      for (let x = 0; x < doc.width; x++) {
        const color = doc.getPixelData(x, y);
        const i = (y * doc.width + x) * 4;
        const rgba = ColorUtils.hexToRgba(color);

        imgData.data[i] = rgba.r;
        imgData.data[i + 1] = rgba.g;
        imgData.data[i + 2] = rgba.b;
        imgData.data[i + 3] = rgba.a;
      }
    }

    context.putImageData(imgData, 0, 0);

    this.startDownload(canvas, doc.width, doc.height);
  }

  private createOffscreenCanvas() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    return { canvas, context };
  }

  private startDownload(canvas: HTMLCanvasElement, width: number, height: number) {
    const link = document.createElement("a");
    link.download = `pixel-asset-${width}x${height}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}