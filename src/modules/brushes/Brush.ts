import PixelDocument from "../editor/core/PixelDocument";

abstract class Brush {
  size = 1;

  paint(
    doc: PixelDocument,
    x: number,
    y: number,
    color: string
  ) {
    //
    console.log(doc, x, y, color);
  }
}

export class CircleBrush extends Brush { }
export class SquareBrush extends Brush { }
export class PatternBrush extends Brush { }
export class AirBrush extends Brush { }