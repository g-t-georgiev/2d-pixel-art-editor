export default class FloodFill {
  static execute(document, startX, startY, targetColor) {
    if (!document.isWithinBounds(startX, startY)) return;

    const originalColor = document.getPixel(startX, startY);
    if (originalColor === targetColor) return;

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (document.isWithinBounds(x, y)) {
        if (document.getPixel(x, y) === originalColor) {
          document.setPixel(x, y, targetColor);

          stack.push([x + 1, y]);
          stack.push([x - 1, y]);
          stack.push([x, y + 1]);
          stack.push([x, y - 1]);
        }
      }
    }
  }
}