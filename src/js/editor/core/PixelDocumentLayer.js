export default class PixelDocumentLayer {
  constructor(id, name, width, height) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.opacity = 1;
    // 1D array is far more performant for pixel processing than 2D arrays
    this.grid = new Array(width * height).fill(null);
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getPixelData(x, y) {
    if (!this.isWithinBounds(x, y)) return null;

    return this.grid[y * this.width + x] ?? null;
  }

  setPixelData(x, y, color) {
    if (!this.isWithinBounds(x, y) || !this.visible) return;

    this.grid[y * this.width + x] = color;
  }

  clear() {
    this.grid.fill(null);
  }
}