import { Sphere } from "./sphere";
import { IMovingSphere, IPlane, IShape, ISphere } from "../models/shape.model";
import { InvalidShapeTypeError, ShapeNotFoundError } from "../utils/errors";
import { Plane } from "./plane";
import { MovingSphere } from "./moving-sphere";
import { Shape } from "./shape";
import { MaterialFactory } from "../materials/factory";

type ShapeIdMap = {
  [x: number]: Shape;
};

export class ShapeFactory {
  shapes: ShapeIdMap = {};
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

  _createUtil(data: IShape) {
    switch (data.type) {
      case "sphere":
        return new Sphere(data as ISphere, this.materialFactory);
      case "moving-sphere":
        return new MovingSphere(data as IMovingSphere, this.materialFactory);
      case "plane":
        return new Plane(data as IPlane, this.materialFactory);
      default:
        throw new InvalidShapeTypeError();
    }
  }

  create(data: IShape): Shape {
    const shape = this._createUtil(data);
    this.shapes[shape.id] = shape;
    return shape;
  }
}
