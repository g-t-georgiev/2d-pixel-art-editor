/** @typedef {import("./PixelEditor.js").default} Editor */

export default class InputController {
  /** 
   * @param {Editor} editor
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} viewport
   */
  constructor(editor, canvas, viewport) {
    /** @type Editor */
    this.editor = editor;
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
      if (e.key === "Alt" && !this.editor.isQuickPicking) {
        this.editor.isQuickPicking = true;
        this.editor.setTool("eyedropper");
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Alt" && this.editor.isQuickPicking) {
        this.editor.isQuickPicking = false;
      }
    });
  }

  getGridCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const { worldX, worldY } = this.editor.camera.screenToWorld(e.clientX, e.clientY, rect);
    return this.editor.camera.worldToGrid(worldX, worldY);
  }

  onMouseDown(ev) {
    if (ev.button === 1) {
      this.editor.isPanning = true;
      this.lastMouse = { x: ev.clientX, y: ev.clientY };
      this.viewport.classList.add("panning");
      this.viewport.setPointerCapture(ev.pointerId);
    } else if (ev.button === 0) {
      this.editor.isDrawing = true;
      const coords = this.getGridCoords(ev);
      this.editor.useActiveTool(coords, "down");
    }
  }

  onMouseMove(ev) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseScreenPos = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

    const coords = this.getGridCoords(ev);
    this.editor.updateCoordsDisplay(coords);

    if (this.editor.isPanning) {
      const dx = ev.clientX - this.lastMouse.x;
      const dy = ev.clientY - this.lastMouse.y;

      this.editor.camera.x += dx;
      this.editor.camera.y += dy;

      this.editor.camera.clamp(
        this.canvas.width,
        this.canvas.height,
        this.editor.document.width,
        this.editor.document.height
      );

      this.lastMouse = { x: ev.clientX, y: ev.clientY };
    } else if (this.editor.isDrawing) {
      this.editor.useActiveTool(coords, "move");
    }
  }

  onMouseUp(ev) {
    if (this.editor.isDrawing) {
      const coords = this.getGridCoords(ev);
      this.editor.useActiveTool(coords, "up");
      this.editor.isDrawing = false;
    } else if (this.editor.isPanning) {
      this.editor.isPanning = false;
      this.viewport.releasePointerCapture(ev.pointerId);
    }

    this.viewport.classList.remove("panning");
  }

  onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const rect = this.canvas.getBoundingClientRect();

    this.editor.camera.calculateZoom(
      e.clientX,
      e.clientY,
      zoomFactor,
      rect,
      this.editor.document.width,
      this.editor.document.height
    );

    this.editor.camera.clamp(
      this.canvas.width,
      this.canvas.height,
      this.editor.document.width,
      this.editor.document.height
    );
  }
}