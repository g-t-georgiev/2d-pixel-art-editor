export default class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 24;
    this.uiPadding = 24;
    this.viewportPadding = 32;
  }

  /** Calculates the exact zoom required to fit the document in the viewport */
  getFitZoom(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight) return 1;

    const availWidth = Math.max(1, canvasWidth - this.viewportPadding * 2 - this.uiPadding);
    const availHeight = Math.max(1, canvasHeight - this.viewportPadding * 2 - this.uiPadding);

    return Math.min(availWidth / docWidth, availHeight / docHeight);
  }

  fitToView(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight || !docWidth || !docHeight) return;

    this.zoom = this.getFitZoom(canvasWidth, canvasHeight, docWidth, docHeight);

    const zoomedWidth = docWidth * this.zoom;
    const zoomedHeight = docHeight * this.zoom;

    this.x = this.uiPadding + (canvasWidth - this.uiPadding - zoomedWidth) / 2;
    this.y = this.uiPadding + (canvasHeight - this.uiPadding - zoomedHeight) / 2;
  }

  calculateZoom(clientX, clientY, zoomFactor, canvasRect, docWidth, docHeight) {
    const minZoom = this.getFitZoom(canvasRect.width, canvasRect.height, docWidth, docHeight);
    const maxZoom = 150;
    const newZoom = Math.max(minZoom, Math.min(this.zoom * zoomFactor, maxZoom));
    const { localX, localY, worldX, worldY } = this.screenToWorld(clientX, clientY, canvasRect);

    this.x = localX - worldX * newZoom;
    this.y = localY - worldY * newZoom;
    this.zoom = newZoom;
  }

  clamp(canvasWidth, canvasHeight, docWidth, docHeight) {
    if (!canvasWidth || !canvasHeight) return;

    const zoomedWidth = docWidth * this.zoom;
    const zoomedHeight = docHeight * this.zoom;

    const overlapRatio = 0.3;
    const marginX = (canvasWidth - this.uiPadding) * (1 - overlapRatio);
    const marginY = (canvasHeight - this.uiPadding) * (1 - overlapRatio);

    const minX = -zoomedWidth + (canvasWidth - marginX);
    const maxX = this.uiPadding + marginX;
    const minY = -zoomedHeight + (canvasHeight - marginY);
    const maxY = this.uiPadding + marginY;

    this.x = Math.min(maxX, Math.max(this.x, minX));
    this.y = Math.min(maxY, Math.max(this.y, minY));
  }

  /**
   * Centers the viewport on a specific world coordinate
   */
  centerOnWorld(worldX, worldY, canvasWidth, canvasHeight) {
    if (!canvasWidth || !canvasHeight) return;

    // Calculate where the world coordinate is in scaled space
    const scaledX = worldX * this.zoom;
    const scaledY = worldY * this.zoom;

    // Adjust camera offset so that scaled point lands in the center of the canvas
    this.x = (canvasWidth / 2) - scaledX;
    this.y = (canvasHeight / 2) - scaledY;
  }

  /**
   * @param {number} screenX 
   * @param {number} screenY 
   * @param {DOMRect} canvasRect 
   */
  screenToWorld(screenX, screenY, canvasRect) {
    const localX = screenX - canvasRect.left;
    const localY = screenY - canvasRect.top;

    const worldX = (localX - this.x) / this.zoom;
    const worldY = (localY - this.y) / this.zoom;

    return { localX, localY, worldX, worldY };
  }

  /**
   * @param {number} worldX 
   * @param {number} worldY 
   */
  worldToGrid(worldX, worldY) {
    return {
      x: Math.floor(worldX),
      y: Math.floor(worldY)
    };
  }
}