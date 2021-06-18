import { MaterialFactory } from "../materials/factory";
import {
  ISphere,
  IMovingSphere,
  IPlane,
  IRectangle,
  IAbstractShape,
  ITranslate,
  IBox,
  IRotate,
} from "../models/shape.model";
import { ShapeNotFoundError, InvalidShapeTypeError } from "../utils/errors";
import { AbstractShape } from "./abstract-shape";
import { Box } from "./material-shapes/box";
import { MovingSphere } from "./material-shapes/moving-sphere";
import { Plane } from "./material-shapes/plane";
import { Rectangle } from "./material-shapes/rectangle";
import { Sphere } from "./material-shapes/sphere";
import { Rotate } from "./transform-shapes/rotate";
import { Translate } from "./transform-shapes/translate";

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

  create(data: IAbstractShape) {
    switch (data.type) {
      case "sphere":
        return new Sphere(data as ISphere, this.materialFactory);
      case "moving-sphere":
        return new MovingSphere(data as IMovingSphere, this.materialFactory);
      case "plane":
        return new Plane(data as IPlane, this.materialFactory);
      case "rectangle":
        return new Rectangle(data as IRectangle, this.materialFactory);
      case "box":
        return new Box(data as IBox, this.materialFactory);
      // transform shapes
      case "translation":
        return new Translate(data as ITranslate, this);
      case "rotation":
        return new Rotate(data as IRotate, this);
      default:
        throw new InvalidShapeTypeError();
    }
  }

  createAndPush(data: IAbstractShape): AbstractShape {
    const shape = this.create(data);
    this.shapes.push(shape);
    return shape;
  }
}
