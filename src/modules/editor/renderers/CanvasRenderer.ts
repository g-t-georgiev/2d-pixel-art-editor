import type Application from "../Application";
import type Camera from "../Camera";
import BackgroundRenderer from "./BackgroundRenderer";
import DocumentRenderer from "./DocumentRenderer";
import GridOverlayRenderer from "./GridOverlayRenderer";
import RulersOverlayRenderer from "./RulersOverlayRenderer";
import CursorOverlayRenderer from "./CursorOverlayRenderer";

export default class CanvasRenderer {
  private context: CanvasRenderingContext2D;

  readonly backgroundRenderer!: BackgroundRenderer;
  readonly documentRenderer!: DocumentRenderer;
  readonly gridOverlayRenderer!: GridOverlayRenderer;
  readonly rulerOverlayRenderer!: RulersOverlayRenderer;
  readonly cursorOverlayRenderer!: CursorOverlayRenderer;

  constructor(
    public app: Application,
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

  get showGrid() {
    return this.gridOverlayRenderer.showGrid;
  }

  set showGrid(value) {
    this.gridOverlayRenderer.showGrid = value;
  }

  render(mouseScreenPos: { x: number; y: number; } = { x: -1, y: -1 }) {
    const DPR = this.app.devicePixelRatio;
    const { document, isDrawing, tools, penSize, currentColor } = this.app;

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

    this.backgroundRenderer.render(this.app.document.width, this.app.document.height);
    this.documentRenderer.render(this.app.document);
    this.gridOverlayRenderer.render(this.app.document);

    if (!isDrawing) {
      // Hover Preview overlay
      const rect = this.canvas.getBoundingClientRect();
      const { worldX, worldY } = this.camera.screenToWorld(
        mouseScreenPos.x + rect.left,
        mouseScreenPos.y + rect.top,
        rect
      );
      const gridCoords = this.camera.worldToGrid(worldX, worldY);
      const activeToolName = tools.getActiveTool()?.name;
      this.cursorOverlayRenderer.render(document, gridCoords, activeToolName, penSize, currentColor);
    }

    this.context.restore(); // Exit camera space, back to CSS screen space

    // UI Overlays
    this.rulerOverlayRenderer.render(
      this.app.canvasWidthInCSSPixels,
      this.app.canvasHeightInCSSPixels,
      mouseScreenPos
    );

    this.context.restore(); // Exit DPR scaling space
  }
}