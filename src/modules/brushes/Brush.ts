import PixelDocument from "../editor/core/PixelDocument";

abstract class Brush {
  size = 1;

  paint(
    document: PixelDocument,
    x: number,
    y: number,
    color: string
  ) {
    //
    console.log(document, x, y, color);
  }
}

export class CircleBrush extends Brush { }
export class SquareBrush extends Brush { }
export class PatternBrush extends Brush { }
export class AirBrush extends Brush { }