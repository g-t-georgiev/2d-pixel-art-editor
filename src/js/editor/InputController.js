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
    this.viewport.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.viewport.addEventListener("wheel", (e) => this.onWheel(e), { passive: false });

    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e));

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

  onMouseDown(e) {
    const isPanAction = e.button === 1;

    if (isPanAction) {
      this.editor.isPanning = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.viewport.classList.add("panning");
    } else if (e.button === 0) {
      this.editor.isDrawing = true;
      const coords = this.getGridCoords(e);
      this.editor.useActiveTool(coords, "down");
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseScreenPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const coords = this.getGridCoords(e);
    this.editor.updateCoordsDisplay(coords);

    if (this.editor.isPanning) {
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;

      this.editor.camera.x += dx;
      this.editor.camera.y += dy;

      this.editor.camera.clamp(
        this.canvas.width,
        this.canvas.height,
        this.editor.document.width,
        this.editor.document.height
      );

      this.lastMouse = { x: e.clientX, y: e.clientY };
    } else if (this.editor.isDrawing) {
      this.editor.useActiveTool(coords, "move");
    }
  }

  onMouseUp(e) {
    if (this.editor.isDrawing) {
      const coords = this.getGridCoords(e);
      this.editor.useActiveTool(coords, "up");
    }
    this.editor.isDrawing = false;
    this.editor.isPanning = false;
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