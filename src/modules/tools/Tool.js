export default class Tool {
  constructor(name) {
    if (new.target === Tool) {
      throw new TypeError("Cannot construct \"Tool\" instances directly.");
    }
    this.name = name;
  }

  /**
   * @param {{x: number, y: number}} coords
   * @param {object} context
   * @param {import("../editor/core/PixelDocument.js").default} context.document
   * @param {string} context.color
   * @param {number} context.size
   * @param {boolean} context.isDrawing
   */
  onMouseDown(coords, context) {
    throw new Error("Method \"onMouseDown\" must be implemented.");
  }

  onMouseMove(coords, context) { return; }
  onMouseUp(coords, context) { return; }
}