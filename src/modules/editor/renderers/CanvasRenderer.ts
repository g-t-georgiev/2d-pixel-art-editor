import type { Position } from "@modules/types";
import type Application from "@modules/editor/Application";
import type Camera from "@modules/editor/Camera";
import type PixelDocument from "@modules/editor/core/PixelDocument";
import type { ToolManager } from "@modules/tools";
import {
  BackgroundRenderer,
  DocumentRenderer,
  GridOverlayRenderer,
  RulersOverlayRenderer,
  CursorOverlayRenderer
} from "@modules/editor/renderers/renderersExport";
import { applicationStore } from "@modules/store";

export default class CanvasRenderer {
  private context: CanvasRenderingContext2D;

  readonly backgroundRenderer!: BackgroundRenderer;
  readonly documentRenderer!: DocumentRenderer;
  readonly gridOverlayRenderer!: GridOverlayRenderer;
  readonly rulerOverlayRenderer!: RulersOverlayRenderer;
  readonly cursorOverlayRenderer!: CursorOverlayRenderer;

  constructor(
    public app: Application,
    private doc: PixelDocument,
    private tools: ToolManager,
    private canvas: HTMLCanvasElement,
    private camera: Camera,
    rulerSize = 24
  ) {
    this.context = canvas.getContext("2d")!;

    // Sub-renderers
    this.backgroundRenderer = new BackgroundRenderer(this.context);
    this.documentRenderer = new DocumentRenderer(this.context, camera);
    this.gridOverlayRenderer = new GridOverlayRenderer(this.context, camera);
    this.rulerOverlayRenderer = new RulersOverlayRenderer(this.context, camera, rulerSize);
    this.cursorOverlayRenderer = new CursorOverlayRenderer(this.context, camera);
  }

  render(mouseScreenPos: Position = { x: -1, y: -1 }) {
    const DPR = this.app.devicePixelRatio;
    const { penSize, currentColor} = applicationStore.getState();
    const {
      isDrawing,
      canvasWidthInCSSPixels,
      canvasHeightInCSSPixels
    } = this.app;

    // Disable pixel smoothing for crisp pixel art rendering
    if (this.context.imageSmoothingEnabled) this.context.imageSmoothingEnabled = false;

    // Clear workspace buffer
    this.context.fillStyle = "#33353d";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    // Scale everything below to CSS pixel units
    this.context.scale(DPR, DPR);

    // World Space Pass
    this.context.save();
    this.context.translate(this.camera.x, this.camera.y);
    this.context.scale(this.camera.zoom, this.camera.zoom);

    this.backgroundRenderer.render(this.doc.width, this.doc.height);
    this.documentRenderer.render(this.doc);
    this.gridOverlayRenderer.render(this.doc);

    if (!isDrawing) {
      // Hover Preview overlay
      const rect = this.canvas.getBoundingClientRect();
      const { worldX, worldY } = this.camera.screenToWorld(
        mouseScreenPos.x + rect.left,
        mouseScreenPos.y + rect.top,
        rect
      );
      const gridCoords = this.camera.worldToGrid(worldX, worldY);
      const activeToolName = this.tools.getActiveTool()?.name;
      this.cursorOverlayRenderer.render(this.doc, gridCoords, activeToolName, penSize, currentColor);
    }

    this.context.restore(); // Exit camera space, back to CSS screen space

    // UI Overlays
    this.rulerOverlayRenderer.render(canvasWidthInCSSPixels, canvasHeightInCSSPixels, mouseScreenPos);

    this.context.restore(); // Exit DPR scaling space
  }
}