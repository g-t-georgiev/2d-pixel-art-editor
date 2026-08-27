import type Application from "../Application";
import type { ToolType } from "../../tools/types";
import type { ColorChangeEventShape, ColorPickerButton } from "color-picker";
import { applicationStore, ApplicationStateActions } from "../../store";
import { color } from "../../types";

const Elements = {
  documentSizeSelect: document.getElementById("documentSizeSelect"),
  penSizeSelect: document.getElementById("penSizeSelect"),
  colorPicker: document.querySelector<ColorPickerButton>("#colorPicker"),
  gridToggleBtn: document.getElementById("gridToggleBtn"),
  coordsDisplay: document.getElementById("coordsDisplay"),
  zoomDisplay: document.getElementById("zoomDisplay"),
  btnZoomIn: document.getElementById("btnZoomIn"),
  btnZoomOut: document.getElementById("btnZoomOut"),
  btnZoomFit: document.getElementById("btnZoomFit"),
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

  constructor(
    private app: Application
  ) {
    this.attachDOMEventListeners();
    this.attachStateChangeListeners();
  }

  private attachDOMEventListeners() {
    const { btnExport } = this.elements;

    this.attachToolHandlers();
    this.attachColorChangeHandlers();
    this.attachDocumentHandlers();
    this.attachZoomButtonHandlers();

    btnExport?.addEventListener("click", () => this.app.exportPNG());
  }

  private attachZoomButtonHandlers() {
    const { btnZoomIn, btnZoomOut, btnZoomFit } = this.elements;

    // Zoom Buttons
    btnZoomIn?.addEventListener("click", () => {
      this.app.zoomBy(1.2);
    });

    btnZoomOut?.addEventListener("click", () => {
      this.app.zoomBy(0.8);
    });

    btnZoomFit?.addEventListener("click", () => this.app.fitToView());
  }

  private attachColorChangeHandlers() {
    const { colorPicker } = this.elements;

    // Color Picker
    colorPicker?.addEventListener("color-changed", ((ev: CustomEvent<ColorChangeEventShape>) => {
      applicationStore.dispatch(
        ApplicationStateActions.SetColor,
        { color: ev.detail.hex, updateUi: false }
      )
    }) as EventListener);

    // Palette Swatches
    const colorSwatches = document.querySelectorAll<HTMLElement>(".palette-swatch");
    colorSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const color = swatch.dataset.color;

        if (!color) {
          console.warn(`Invalid color format. Expected valid CSS color format, got ${color}`);

          return;
        }

        applicationStore.dispatch(
          ApplicationStateActions.SetColor,
          { color, updateUi: true }
        );
      });
    });
  }

  private attachDocumentHandlers() {
    const { gridToggleBtn, documentSizeSelect, btnClear} = this.elements;

    gridToggleBtn?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      applicationStore.dispatch(ApplicationStateActions.ToggleGrid, { enabled: target.checked });
    });

    documentSizeSelect?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      const [w, h] = target.value.split("x").map(Number);
      applicationStore.dispatch(ApplicationStateActions.ResizeDocument, { width: w, height: h });
    });

    btnClear?.addEventListener("click", () => this.app.clearDocument());
  }

  private attachToolHandlers() {
    const { tools, penSizeSelect } = this.elements;

    const toolBtnKeys = Object.keys(tools) as ToolType[];
    toolBtnKeys.forEach((name) => {
      const toolBtn = tools[name];
      toolBtn?.addEventListener("click", () =>
        applicationStore.dispatch(ApplicationStateActions.SetTool, name)
      );
    });

    penSizeSelect?.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      const value = parseInt(target.value, 10);
      applicationStore.dispatch(ApplicationStateActions.EditPen, { size: value });
    });
  }

  private attachStateChangeListeners() {
    applicationStore.on(ApplicationStateActions.SetColor, (event) => {
      const { color, updateUi } = event.payload;

      if (!updateUi) return;

      this.updateColorUI(color);
    });

    applicationStore.select(
      (state) => state.currentTool,
      (tool) => this.setActiveTool(tool)
    );
  }

  private setActiveTool(name: ToolType) {
    const activeToolBtns = Object.entries(this.elements.tools)
      .filter(([_, button]) => button?.classList.contains("active"));

    const requestedActiveToolBtn = this.elements.tools[name];

    if (activeToolBtns.some(([_, button]) => requestedActiveToolBtn === button)) return;

    requestedActiveToolBtn?.classList.add("active");
    activeToolBtns.forEach(([_, button]) => button?.classList.remove("active"));
  }

  private updateColorUI(color: color) {
    if (!this.elements.colorPicker) return;

    // Because "null" value represents empty/transparent color, but we can't pass null as a color
    // value for the color picker widget, we should convert it to a transparent CSS color.
    color ??= "rgba(0, 0, 0, 0)";

    this.elements.colorPicker.setAttribute("value", color);
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