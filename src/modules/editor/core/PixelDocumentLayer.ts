export default class PixelDocumentLayer {
  visible: boolean = true;
  opacity: number = 1;
  grid: Array<string | null>;

  constructor(
    readonly id: string,
    readonly name: string,
    public width: number,
    public height: number
  ) {
    this.grid = new Array(width * height).fill(null);
  }

  isWithinBounds(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getPixelData(x: number, y: number) {
    if (!this.isWithinBounds(x, y)) return null;

    return this.grid[y * this.width + x] ?? null;
  }

  setPixelData(x: number, y: number, color: string | null) {
    if (!this.isWithinBounds(x, y) || !this.visible) return;

    this.grid[y * this.width + x] = color;
  }

  clear() {
    this.grid.fill(null);
  }
}