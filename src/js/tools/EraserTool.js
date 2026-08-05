import Tool from "./Tool.js";

export default class EraserTool extends Tool {
  constructor() {
    super("eraser");
  }

  onMouseDown(coords, editor) {
    this.draw(coords, editor);
  }

  onMouseMove(coords, editor) {
    if (editor.isDrawing) {
      this.draw(coords, editor);
    }
  }

  draw({ x, y }, editor) {
    const size = editor.penSize;
    const halfSize = Math.floor(size / 2);

    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = x - halfSize + dx;
        const py = y - halfSize + dy;

        editor.document.setPixel(px, py, null);
      }
    }
  }
}