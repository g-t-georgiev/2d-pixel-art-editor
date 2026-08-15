export default class BackgroundRenderer {
  constructor(context) {
    this.ctx = context;
    this.pattern = this.createCheckerPattern();
  }

  createCheckerPattern() {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 2;
    patternCanvas.height = 2;
    const pCtx = patternCanvas.getContext("2d");

    pCtx.fillStyle = "#2a2d36";
    pCtx.fillRect(0, 0, 2, 2);

    pCtx.fillStyle = "#22242b";
    pCtx.fillRect(0, 0, 1, 1);
    pCtx.fillRect(1, 1, 1, 1);

    return this.ctx.createPattern(patternCanvas, "repeat");
  }

  render(width, height) {
    this.ctx.save();

    this.ctx.fillStyle = "#22242b";
    this.ctx.fillRect(0, 0, width, height);

    if (this.pattern) {
      this.ctx.fillStyle = this.pattern;

      // Draws inside transformed world coordinates [0..width, 0..height]
      this.ctx.fillRect(0, 0, width, height);
    }

    this.ctx.restore();
  }
}