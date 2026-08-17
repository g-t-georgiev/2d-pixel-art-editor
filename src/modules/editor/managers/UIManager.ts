import type Application from "../Application";
import type { ToolType } from "../../tools/ToolManager";

const Elements = {
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
  tools: {
    pen: document.getElementById("toolPen"),
    bucket: document.getElementById("toolBucket"),
    eraser: document.getElementById("toolEraser"),
    eyedropper: document.getElementById("toolEyedropper"),
  }
} as const;

export default class UIManager {
  elements = Elements;

  constructor(private app: Application) {
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
    const toolBtnKeys = Object.keys(tools) as ToolType[];
    toolBtnKeys.forEach((name) => {
      const toolBtn = tools[name];
      toolBtn?.addEventListener("click", () => {
        this.app.setTool(name);
      });
    });

    // Inputs
    colorPicker?.addEventListener("input", (ev: InputEvent) => {
      const target = ev.target as HTMLInputElement;
      this.app.currentColor = target.value;
    });
    penSizeSelect?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      this.app.penSize = parseInt(target.value, 10);
    });
    gridSizeSelect?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      const [w, h] = target.value.split("x").map(Number);
      this.app.resizeDocument(w, h);
    });
    toggleGrid?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      this.app.renderer.showGrid = target.checked;
    });

    // Palette Swatches
    const colorSwatches = document.querySelectorAll<HTMLElement>(".palette-swatch");
    colorSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const color = swatch.dataset.color;

        if (!color) {
          console.warn(`Invalid color format. Expected valid CSS color format, got ${color}`);

          return;
        }

        this.app.setColor(color);
      });
    });

    // Zoom Buttons
    btnZoomIn?.addEventListener("click", () => {
      this.app.zoomBy(1.2);
    });
    btnZoomOut?.addEventListener("click", () => {
      this.app.zoomBy(0.8);
    });
    btnZoomReset?.addEventListener("click", () => this.app.resetView());

    // Actions
    btnClear?.addEventListener("click", () => this.app.clearDocument());
    btnExport?.addEventListener("click", () => this.app.exportPNG());
  }

  setActiveTool(name: ToolType) {
    const activeToolBtns = Object.entries(this.elements.tools)
      .filter(([_, button]) => button?.classList.contains("active"));

    const requestedActiveToolBtn = this.elements.tools[name];

    if (activeToolBtns.some(([_, button]) => requestedActiveToolBtn === button)) return;

    requestedActiveToolBtn?.classList.add("active");
    activeToolBtns.forEach(([_, button]) => button?.classList.remove("active"));
  }

  updateColorUI(color: string) {
    if (!this.elements.colorPicker) return;

    const colorPicker = this.elements.colorPicker as HTMLInputElement;

    colorPicker.value = color;
  }

  updateStatus(coords: { x: number; y: number; }, zoom: number) {
    if (this.elements.coordsDisplay) {
      this.elements.coordsDisplay.textContent = `X: ${coords.x}, Y: ${coords.y}`;
    }
    if (this.elements.zoomDisplay) {
      this.elements.zoomDisplay.textContent = `Zoom: ${Math.round((zoom / 24) * 100)}%`;
    }
  }
}