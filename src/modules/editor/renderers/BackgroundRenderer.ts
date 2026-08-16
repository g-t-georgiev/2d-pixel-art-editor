export default class BackgroundRenderer {
  pattern: CanvasPattern;

  constructor(private context: CanvasRenderingContext2D) {
    this.pattern = this.createCheckerPattern()!;
  }

  private createCheckerPattern() {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 2;
    patternCanvas.height = 2;
    const pCtx = patternCanvas.getContext("2d")!;

    pCtx.fillStyle = "#2a2d36";
    pCtx.fillRect(0, 0, 2, 2);

    pCtx.fillStyle = "#22242b";
    pCtx.fillRect(0, 0, 1, 1);
    pCtx.fillRect(1, 1, 1, 1);

    return this.context.createPattern(patternCanvas, "repeat");
  }

  render(width: number, height: number) {
    this.context.save();

    this.context.fillStyle = "#22242b";
    this.context.fillRect(0, 0, width, height);

    if (this.pattern) {
      this.context.fillStyle = this.pattern;

      // Draws inside transformed world coordinates [0..width, 0..height]
      this.context.fillRect(0, 0, width, height);
    }

    this.context.restore();
  }
}