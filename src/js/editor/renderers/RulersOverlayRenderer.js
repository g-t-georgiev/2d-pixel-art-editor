export default class RulersOverlayRenderer {
  constructor(context, camera, size = 24, mouseIndicatorThickness = 2) {
    /** @type CanvasRenderingContext2D */
    this.ctx = context;
    this.camera = camera;
    this.size = size;
    this.mouseIndicatorThickness = mouseIndicatorThickness;

    this.style = {
      barColor: "#23262d",
      labelColor: "#9fa6ae",
      dividerColor: "#9fa6ae",
      highlightColor: "#66fffb",
      cornerColor: "#363940",
      majorLength: 10,
      middleLength: 16,
      minorLength: 20
    };
  }

  getNiceStep(rawStep) {
    const exponent = Math.floor(Math.log10(rawStep));
    const fraction = rawStep / Math.pow(10, exponent);
    let niceFraction = 10;

    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;

    // Enforce an absolute minimum step of 1 document pixel
    return Math.max(1, niceFraction * Math.pow(10, exponent));
  }

  render(canvasWidth, canvasHeight, mouseScreenPos) {
    this.ctx.save();
    this.ctx.font = "12px sans-serif";
    this.ctx.lineWidth = 1;

    const minPixelSpacing = 53;
    const step = this.getNiceStep(minPixelSpacing / this.camera.zoom);
    const subStep = step / 10;

    this.drawRulerAxis(canvasWidth, this.camera.x, subStep, false);
    this.drawRulerAxis(canvasHeight, this.camera.y, subStep, true);
    this.drawMouseIndicators(mouseScreenPos);
    this.drawCornerBox(canvasWidth, canvasHeight);

    this.ctx.restore();
  }

  drawRulerAxis(length, cameraOffset, subStep, isVertical) {
    const size = this.size;
    const ctx = this.ctx;
    const zoom = this.camera.zoom;

    ctx.fillStyle = this.style.barColor;
    if (isVertical) {
      ctx.fillRect(0, size, size, length - size);
    } else {
      ctx.fillRect(size, 0, length - size, size);
    }

    const startWorld = (size - cameraOffset) / zoom;
    const endWorld = (length - cameraOffset) / zoom;
    const startK = Math.floor(startWorld / subStep);
    const endK = Math.ceil(endWorld / subStep);

    ctx.beginPath();
    ctx.strokeStyle = this.style.dividerColor;

    for (let k = startK; k <= endK; k++) {
      const worldPos = k * subStep;
      const screenPos = Math.round(worldPos * zoom + cameraOffset) + 0.5;

      if (screenPos < size || screenPos > length) continue;

      const isMajor = k % 10 === 0;
      const isMiddle = k % 5 === 0;
      const lineOffset = isMajor ? this.style.majorLength : isMiddle ? this.style.middleLength : this.style.minorLength;

      if (isVertical) {
        ctx.moveTo(lineOffset, screenPos);
        ctx.lineTo(size, screenPos);
      } else {
        ctx.moveTo(screenPos, lineOffset);
        ctx.lineTo(screenPos, size);
      }

      if (isMajor) {
        const labelText = Math.abs(worldPos) < 1e-6 ? 0 : Math.round(worldPos);
        ctx.fillStyle = this.style.labelColor;

        if (isVertical) {
          ctx.save();
          ctx.translate(2, screenPos + 3);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.fillText(`${labelText}`, 0, 0);
          ctx.restore();
        } else {
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(`${labelText}`, screenPos + 3, 2);
        }
      }
    }
    ctx.stroke();
  }

  drawMouseIndicators({ x, y }) {
    const size = this.size;
    const ctx = this.ctx;

    ctx.lineWidth = this.mouseIndicatorThickness;
    ctx.strokeStyle = this.style.highlightColor;
    ctx.beginPath();

    if (x >= size) {
      const mx = Math.round(x) + 0.5;
      ctx.moveTo(mx, 0); ctx.lineTo(mx, size);
    }
    if (y >= size) {
      const my = Math.round(y) + 0.5;
      ctx.moveTo(0, my); ctx.lineTo(size, my);
    }

    ctx.stroke();
  }

  drawCornerBox(width, height) {
    const size = this.size;
    const ctx = this.ctx;

    ctx.fillStyle = this.style.cornerColor;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = this.style.dividerColor;
    ctx.beginPath();
    ctx.moveTo(size, size + 0.5); ctx.lineTo(width, size + 0.5);
    ctx.moveTo(size + 0.5, size); ctx.lineTo(size + 0.5, height);
    ctx.stroke();

    ctx.font = "10px sans-serif";
    ctx.fillStyle = this.style.labelColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("px", size / 2, size / 2);
  }
}