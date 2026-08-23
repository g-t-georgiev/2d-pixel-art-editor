import type Application from "../Application";
import type Camera from "../Camera";
import type CanvasRenderer from "../renderers/CanvasRenderer";
import { ApplicationStateActions, applicationStore } from "../../store";

export enum MouseButton {
  Left,
  Middle,
  Right,
}

export enum PointerEventType {
  Down = "down",
  Move = "move",
  Up = "up",
}


export default class InputController {
  private lastMouse: { x: number; y: number; } = { x: 0, y: 0 };

  public mouseScreenPos: { x: number; y: number; } = { x: -1, y: -1 };

  constructor(
    private app: Application,
    private camera: Camera,
    private renderer: CanvasRenderer,
    private canvas: HTMLCanvasElement,
    private viewport: HTMLElement
  ) {
    this.attachListeners();
  }

  attachListeners() {
    this.viewport.addEventListener("pointerdown", (ev) => this.onMouseDown(ev));
    this.viewport.addEventListener("wheel", (ev) => this.onWheel(ev), { passive: false });

    this.viewport.addEventListener("pointermove", (ev) => this.onMouseMove(ev));
    this.viewport.addEventListener("pointerup", (ev) => this.onMouseUp(ev));

    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Alt" && !this.app.isQuickColorPicking) {
        this.app.isQuickColorPicking = true;
        applicationStore.dispatch(ApplicationStateActions.SetTool, "eyedropper");
      }
    });

    window.addEventListener("keyup", (ev) => {
      if (ev.key === "Alt" && this.app.isQuickColorPicking) {
        this.app.isQuickColorPicking = false;
      }
    });
  }

  getGridCoords(ev: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const { worldX, worldY } = this.camera.screenToWorld(ev.clientX, ev.clientY, rect);

    return this.camera.worldToGrid(worldX, worldY);
  }

  onMouseDown(ev: PointerEvent) {
    if (ev.button === 1) {
      this.app.isPanning = true;
      this.lastMouse = { x: ev.clientX, y: ev.clientY };
      this.viewport.classList.add("panning");
      this.viewport.setPointerCapture(ev.pointerId);
    } else if (ev.button === 0) {
      this.app.isDrawing = true;
      const coords = this.getGridCoords(ev);
      this.app.useActiveTool(coords, PointerEventType.Down);
    }
  }

  onMouseMove(ev: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();

    const localX = ev.clientX - rect.left;
    const localY = ev.clientY - rect.top;

    // Clamp mouse positions to ruler track bounds
    const ruler = this.renderer.rulerOverlayRenderer;
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

      this.app.updateCameraPos(dx, dy);
      this.lastMouse = { x: ev.clientX, y: ev.clientY };
    } else if (this.app.isDrawing) {
      this.app.useActiveTool(coords, PointerEventType.Move);
    }
  }

  onMouseUp(ev: PointerEvent) {
    if (this.app.isDrawing) {
      const coords = this.getGridCoords(ev);
      this.app.useActiveTool(coords, PointerEventType.Up);
      this.app.isDrawing = false;
    } else if (this.app.isPanning) {
      this.app.isPanning = false;
      this.viewport.releasePointerCapture(ev.pointerId);
    }

    this.viewport.classList.remove("panning");
  }

  onWheel(ev: WheelEvent) {
    ev.preventDefault();
    this.app.updateCameraZoom(ev.clientX, ev.clientY, ev.deltaY);
  }
}