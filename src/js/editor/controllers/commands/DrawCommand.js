export default class DrawCommand {
  constructor(document, layerId, pixels) {
    this.document = document;
    this.layerId = layerId;
    /** @type Array<{ x: number; y: number; oldColor: string; newColor: string; }> */
    this.pixels = pixels;
  }

  execute() {
    this.pixels.forEach((p) => this.document.setPixelData(p.x, p.y, p.newColor, this.layerId));
  }

  undo() {
    this.pixels.forEach((p) => this.document.setPixelData(p.x, p.y, p.oldColor, this.layerId));
  }
}