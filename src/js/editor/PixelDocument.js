export default class PixelDocument {
  width = 16;
  height = 16;

  constructor(width = 16, height = 16) {
    this.resize(width, height);
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array(height).fill(null).map(() => Array(width).fill(null));
  }

  clear() {
    this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(null));
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getPixel(x, y) {
    return this.isWithinBounds(x, y) ? this.grid[y][x] : null;
  }

  setPixel(x, y, color) {
    if (this.isWithinBounds(x, y)) {
      this.grid[y][x] = color;
    }
  }
}