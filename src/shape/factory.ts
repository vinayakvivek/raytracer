import { MaterialFactory } from "../materials/factory";
import {
  ISphere,
  IMovingSphere,
  IPlane,
  IRectangle,
  IAbstractShape,
} from "../models/shape.model";
import { ShapeNotFoundError, InvalidShapeTypeError } from "../utils/errors";
import { AbstractShape } from "./abstract-shape";
import { MovingSphere } from "./material-shapes/moving-sphere";
import { Plane } from "./material-shapes/plane";
import { Rectangle } from "./material-shapes/rectangle";
import { Sphere } from "./material-shapes/sphere";

export class ShapeFactory {
  shapes: AbstractShape[] = [];
  materialFactory: MaterialFactory;

  constructor(materialFactory: MaterialFactory) {
    this.materialFactory = materialFactory;
  }

  getById(id: number) {
    if (id in this.shapes) {
      return this.shapes[id];
    }
    throw new ShapeNotFoundError(`id: ${id}`);
  }

  _createUtil(data: IAbstractShape) {
    switch (data.type) {
      case "sphere":
        return new Sphere(data as ISphere, this.materialFactory);
      case "moving-sphere":
        return new MovingSphere(data as IMovingSphere, this.materialFactory);
      case "plane":
        return new Plane(data as IPlane, this.materialFactory);
      case "rectangle":
        return new Rectangle(data as IRectangle, this.materialFactory);
      default:
        throw new InvalidShapeTypeError();
    }
  }

  create(data: IAbstractShape): AbstractShape {
    const shape = this._createUtil(data);
    this.shapes.push(shape);
    return shape;
  }
}
