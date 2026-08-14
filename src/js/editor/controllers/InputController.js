/** @typedef {import("../Application.js").default} Application */

export default class InputController {
  /** 
   * @param {Application} app
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} viewport
   */
  constructor(app, canvas, viewport) {
    /** @type Application */
    this.app = app;
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    /** @type HTMLElement */
    this.viewport = viewport;

    this.lastMouse = { x: 0, y: 0 };
    this.mouseScreenPos = { x: -1, y: -1 };

    this.attachListeners();
  }

  attachListeners() {
    this.viewport.addEventListener("pointerdown", (e) => this.onMouseDown(e));
    this.viewport.addEventListener("wheel", (e) => this.onWheel(e), { passive: false });

    this.viewport.addEventListener("pointermove", (e) => this.onMouseMove(e));
    this.viewport.addEventListener("pointerup", (e) => this.onMouseUp(e));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Alt" && !this.app.isQuickPicking) {
        this.app.isQuickPicking = true;
        this.app.setTool("eyedropper");
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt" && this.app.isQuickPicking) {
        this.app.isQuickPicking = false;
      }
    });
  }

  getGridCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const { worldX, worldY } = this.app.camera.screenToWorld(e.clientX, e.clientY, rect);
    return this.app.camera.worldToGrid(worldX, worldY);
  }

  onMouseDown(ev) {
    if (ev.button === 1) {
      this.app.isPanning = true;
      this.lastMouse = { x: ev.clientX, y: ev.clientY };
      this.viewport.classList.add("panning");
      this.viewport.setPointerCapture(ev.pointerId);
    } else if (ev.button === 0) {
      this.app.isDrawing = true;
      const coords = this.getGridCoords(ev);
      this.app.useActiveTool(coords, "down");
    }
  }

  onMouseMove(ev) {
    const rect = this.canvas.getBoundingClientRect();

    const localX = ev.clientX - rect.left;
    const localY = ev.clientY - rect.top;

    // Clamp mouse positions to ruler track bounds
    const ruler = this.app.renderer.rulerRenderer;
    const minBound = ruler.size + ruler.mouseIndicatorThickness;
    const maxLocalX = rect.width - ruler.mouseIndicatorThickness;
    const maxLocalY = rect.height - ruler.mouseIndicatorThickness;

    this.mouseScreenPos = {
      x: Math.max(minBound, Math.min(localX, maxLocalX)),
      y: Math.max(minBound, Math.min(localY, maxLocalY))
    };

    const coords = this.getGridCoords(ev);
    this.app.updateCoordsDisplay(coords);

    if (this.app.isPanning) {
      const dx = ev.clientX - this.lastMouse.x;
      const dy = ev.clientY - this.lastMouse.y;

      this.app.camera.x += dx;
      this.app.camera.y += dy;

      this.app.camera.clamp(
        this.app.canvasWidthInCSSPixels,
        this.app.canvasHeightInCSSPixels,
        this.app.document.width,
        this.app.document.height
      );

      this.lastMouse = { x: ev.clientX, y: ev.clientY };
    } else if (this.app.isDrawing) {
      this.app.useActiveTool(coords, "move");
    }
  }

  onMouseUp(ev) {
    if (this.app.isDrawing) {
      const coords = this.getGridCoords(ev);
      this.app.useActiveTool(coords, "up");
      this.app.isDrawing = false;
    } else if (this.app.isPanning) {
      this.app.isPanning = false;
      this.viewport.releasePointerCapture(ev.pointerId);
    }

    this.viewport.classList.remove("panning");
  }

  onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const rect = this.canvas.getBoundingClientRect();

    this.app.camera.calculateZoom(
      e.clientX,
      e.clientY,
      zoomFactor,
      rect,
      this.app.document.width,
      this.app.document.height
    );

    this.app.camera.clamp(
      this.app.canvasWidthInCSSPixels,
      this.app.canvasHeightInCSSPixels,
      this.app.document.width,
      this.app.document.height
    );
  }
}