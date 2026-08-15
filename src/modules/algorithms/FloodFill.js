export default class FloodFill {
  static execute(document, startX, startY, targetColor) {
    if (!document.isWithinBounds(startX, startY)) return;

    const originalColor = document.getPixelData(startX, startY);
    if (originalColor === targetColor) return;

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (document.isWithinBounds(x, y)) {
        const isTheSameColor = document.getPixelData(x, y) === originalColor;

        if (!isTheSameColor) continue;

        document.setPixelData(x, y, targetColor);

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
  }
}