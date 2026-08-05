export default class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 24;
    this.rulerSize = 24;
    this.viewportPadding = 32;
  }

  /** Calculates the exact zoom required to fit the document in the viewport */
  getFitZoom(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight) return 1;

    const availWidth = Math.max(1, canvasWidth - this.viewportPadding * 2 - this.rulerSize);
    const availHeight = Math.max(1, canvasHeight - this.viewportPadding * 2 - this.rulerSize);

    return Math.min(availWidth / docWidth, availHeight / docHeight);
  }

  fitToView(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight) return;

    this.zoom = this.getFitZoom(canvasWidth, canvasHeight, docWidth, docHeight);

    const zoomedWidth = docWidth * this.zoom;
    const zoomedHeight = docHeight * this.zoom;

    this.x = this.rulerSize + (canvasWidth - this.rulerSize - zoomedWidth) / 2;
    this.y = this.rulerSize + (canvasHeight - this.rulerSize - zoomedHeight) / 2;
  }

  calculateZoom(clientX, clientY, zoomFactor, canvasRect, docWidth, docHeight) {
    const minZoom = this.getFitZoom(canvasRect.width, canvasRect.height, docWidth, docHeight);
    const maxZoom = 150;

    const newZoom = Math.max(minZoom, Math.min(this.zoom * zoomFactor, maxZoom));

    const { worldX, worldY } = this.screenToWorld(clientX, clientY, canvasRect);

    const screenX = clientX - canvasRect.left;
    const screenY = clientY - canvasRect.top;

    this.x = screenX - worldX * newZoom;
    this.y = screenY - worldY * newZoom;
    this.zoom = newZoom;
  }

  clamp(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight) return;

    const zoomedWidth = docWidth * this.zoom;
    const zoomedHeight = docHeight * this.zoom;

    const overlapRatio = 0.3;
    const marginX = (canvasWidth - this.rulerSize) * (1 - overlapRatio);
    const marginY = (canvasHeight - this.rulerSize) * (1 - overlapRatio);

    const minX = -zoomedWidth + (canvasWidth - marginX);
    const maxX = this.rulerSize + marginX;
    const minY = -zoomedHeight + (canvasHeight - marginY);
    const maxY = this.rulerSize + marginY;

    this.x = Math.min(maxX, Math.max(this.x, minX));
    this.y = Math.min(maxY, Math.max(this.y, minY));
  }

  screenToWorld(clientX, clientY, canvasRect) {
    const screenX = clientX - canvasRect.left;
    const screenY = clientY - canvasRect.top;

    const worldX = (screenX - this.x) / this.zoom;
    const worldY = (screenY - this.y) / this.zoom;

    return { screenX, screenY, worldX, worldY };
  }

  worldToGrid(worldX, worldY) {
    return {
      x: Math.floor(worldX),
      y: Math.floor(worldY)
    };
  }
}