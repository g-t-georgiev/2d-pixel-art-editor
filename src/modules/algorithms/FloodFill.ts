import type { Color, PixelChange } from "@modules/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";

export default class FloodFill {
  static execute(
    doc: PixelDocument,
    startX: number,
    startY: number,
    color: Color
  ) {
    const affectedPixels: PixelChange[] = [];

    if (!doc.isWithinBounds(startX, startY)) return affectedPixels;

    const startColor = doc.getPixelData(startX, startY);
    if (startColor === color) return affectedPixels;

    const width = doc.width;
    const height = doc.height;

    const stack: number[] = [startX, startY];

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;

      let currentX = x;

      while (currentX >= 0 && doc.getPixelData(currentX, y) === startColor) currentX--;

      currentX++;

      let spanAbove = false;
      let spanBelow = false;

      while (currentX < width && doc.getPixelData(currentX, y) === startColor) {
        doc.setPixelData(currentX, y, color);

        affectedPixels.push({
          x: currentX,
          y,
          oldColor: startColor,
          newColor: color
        });

        // Check row above
        if (y > 0) {
          const colorAbove = doc.getPixelData(currentX, y - 1);
          if (!spanAbove && colorAbove === startColor) {
            stack.push(currentX, y - 1);
            spanAbove = true;
          } else if (spanAbove && colorAbove !== startColor) {
            spanAbove = false;
          }
        }

        // Check row below
        if (y < height - 1){
          const colorBelow = doc.getPixelData(currentX, y + 1);
          if (!spanBelow && colorBelow === startColor) {
            stack.push(currentX, y + 1);
            spanBelow = true;
          } else if (spanBelow && colorBelow !== startColor) {
            spanBelow = false;
          }
        }

        currentX++;
      }
    }

    return affectedPixels;
  }
}