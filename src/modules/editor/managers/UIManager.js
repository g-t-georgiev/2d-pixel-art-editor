// Reusable type definitions
/** @typedef {import("../Application.js").default} Application */
/** @typedef {import("../../tools/ToolManager.js").ToolType} ToolType */

export default class UIManager {
  /** @param {Application} app */
  constructor(app) {
    /** @type Application */
    this.app = app;

    this.elements = {
      gridSizeSelect: document.getElementById("gridSizeSelect"),
      penSizeSelect: document.getElementById("penSizeSelect"),
      colorPicker: document.getElementById("colorPicker"),
      toggleGrid: document.getElementById("toggleGrid"),
      coordsDisplay: document.getElementById("coordsDisplay"),
      zoomDisplay: document.getElementById("zoomDisplay"),
      btnZoomIn: document.getElementById("btnZoomIn"),
      btnZoomOut: document.getElementById("btnZoomOut"),
      btnZoomReset: document.getElementById("btnZoomReset"),
      btnClear: document.getElementById("btnClear"),
      btnExport: document.getElementById("btnExport"),
      /** @type {Record<ToolType, HTMLElement>} */
      tools: {
        pen: document.getElementById("toolPen"),
        bucket: document.getElementById("toolBucket"),
        eraser: document.getElementById("toolEraser"),
        eyedropper: document.getElementById("toolEyedropper"),
      }
    };

    this.bindEvents();
  }

  bindEvents() {
    const {
      tools,
      colorPicker,
      penSizeSelect,
      gridSizeSelect,
      toggleGrid,
      btnZoomIn,
      btnZoomOut,
      btnZoomReset,
      btnClear,
      btnExport,
    } = this.elements;

    // Tool buttons
    /** @type ToolType[] */
    const toolBtnKeys = Object.keys(tools);
    toolBtnKeys.forEach((name) => {
      const toolBtn = tools[name];
      toolBtn?.addEventListener("click", () => {
        this.app.setTool(name);
      });
    });

    // Inputs
    colorPicker?.addEventListener("input", (e) => this.app.currentColor = e.target.value);
    penSizeSelect?.addEventListener("change", (e) => this.app.penSize = parseInt(e.target.value, 10));

    gridSizeSelect?.addEventListener("change", (e) => {
      const [w, h] = e.target.value.split("x").map(Number);
      this.app.resizeDocument(w, h);
    });

    toggleGrid?.addEventListener("change", (e) => {
      this.app.renderer.showGrid = e.target.checked;
    });

    // Palette Swatches
    document.querySelectorAll(".palette-swatch").forEach(swatch => {
      swatch.addEventListener("click", () => {
        const color = swatch.dataset.color;
        this.app.setColor(color);
      });
    });

    // Zoom Buttons
    btnZoomIn?.addEventListener("click", () => this.app.zoomBy(1.2));
    btnZoomOut?.addEventListener("click", () => this.app.zoomBy(0.8));
    btnZoomReset?.addEventListener("click", () => this.app.resetView());

    // Actions
    btnClear?.addEventListener("click", () => this.app.clearDocument());
    btnExport?.addEventListener("click", () => this.app.exportPNG());
  }

  /** @param {ToolType} name */
  setActiveTool(name) {
    const activeToolBtns = Object.entries(this.elements.tools)
      .filter(([_, button]) => button.classList.contains("active"));

    const requestedActiveToolBtn = this.elements.tools[name];

    if (activeToolBtns.some(([_, button]) => requestedActiveToolBtn === button)) return;

    requestedActiveToolBtn.classList.add("active");
    activeToolBtns.forEach(([_, button]) => button.classList.remove("active"));
  }

  updateColorUI(color) {
    if (this.elements.colorPicker) {
      this.elements.colorPicker.value = color;
    }
  }

  updateStatus(coords, zoom) {
    if (this.elements.coordsDisplay) {
      this.elements.coordsDisplay.textContent = `X: ${coords.x}, Y: ${coords.y}`;
    }
    if (this.elements.zoomDisplay) {
      this.elements.zoomDisplay.textContent = `Zoom: ${Math.round((zoom / 24) * 100)}%`;
    }
  }
}