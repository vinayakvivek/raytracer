import { AbstractShape } from "../shape/abstract-shape";
import { Point3, Vec3 } from "../utils";
import { PDF } from "./pdf";

export class ShapePDF extends PDF {
  shape: AbstractShape;
  origin: Point3;

  constructor(shape: AbstractShape, origin: Point3) {
    super();
    this.shape = shape;
    this.origin = origin;
  }

  value(direction: Vec3): number {
    return this.shape.pdfValue(this.origin, direction);
  }

  generate(): Vec3 {
    return this.shape.random(this.origin);
  }
}
