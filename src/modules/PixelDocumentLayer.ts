import type { Color, PixelChange } from "@modules/types";

export default class PixelDocumentLayer {
  opacity: number = 1;
  grid: Array<Color>;

  constructor(
    readonly id: string,
    readonly name: string,
    public width: number,
    public height: number,
    public visible: boolean = true,
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

  setPixelData(x: number, y: number, color: Color) {
    if (!this.isWithinBounds(x, y)) return;

    this.grid[y * this.width + x] = color;
  }

  clear() {
    const isNotEmpty = this.grid.some((value) => value !== null);
    const changes: PixelChange[] = [];

    if (isNotEmpty) {
      for (let i = 0; i < this.grid.length; i++) {
        const oldColor = this.grid[i];

        if (oldColor === null) continue;

        this.grid[i] = null;

        const col = i % this.width;
        const row = Math.floor(i / this.width);

        changes.push({
          x: col,
          y: row,
          oldColor,
          newColor: null
        });
      }
    }

    return changes;
  }
}