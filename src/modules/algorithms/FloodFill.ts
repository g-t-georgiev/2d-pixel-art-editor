import type { Color, PixelChange } from "@modules/types";
import type PixelDocument from "@modules/editor/core/PixelDocument";

export default class FloodFill {
  static execute(
    document: PixelDocument,
    startX: number,
    startY: number,
    color: Color
  ) {
    const affectedPixels: PixelChange[] = [];

    if (!document.isWithinBounds(startX, startY)) return affectedPixels;

    const startColor = document.getPixelData(startX, startY);
    if (startColor === color) return affectedPixels;

    const width = document.width;
    const height = document.height;

    const stack: number[] = [startX, startY];

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;

      let currentX = x;

      while (currentX >= 0 && document.getPixelData(currentX, y) === startColor) currentX--;

      currentX++;

      let spanAbove = false;
      let spanBelow = false;

      while (currentX < width && document.getPixelData(currentX, y) === startColor) {
        document.setPixelData(currentX, y, color);

        affectedPixels.push({
          x: currentX,
          y,
          oldColor: startColor,
          newColor: color
        });

        // Check row above
        if (y > 0) {
          const colorAbove = document.getPixelData(currentX, y - 1);
          if (!spanAbove && colorAbove === startColor) {
            stack.push(currentX, y - 1);
            spanAbove = true;
          } else if (spanAbove && colorAbove !== startColor) {
            spanAbove = false;
          }
        }

        // Check row below
        if (y < height - 1){
          const colorBelow = document.getPixelData(currentX, y + 1);
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