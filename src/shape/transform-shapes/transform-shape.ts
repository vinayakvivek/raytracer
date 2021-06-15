import { Ray } from "../../core/ray";
import { Intersection } from "../../models/intersection.model";
import { ITransformShape } from "../../models/shape.model";
import { UnimplementedError } from "../../utils/errors";
import { AbstractShape } from "../abstract-shape";
import { ShapeFactory } from "../factory";

export class TransformShape extends AbstractShape {
  shape: AbstractShape;

  constructor(props: ITransformShape, shapeFactory: ShapeFactory) {
    super();
    this.shape = shapeFactory.create(props.shape);
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    throw new UnimplementedError();
  }
}
