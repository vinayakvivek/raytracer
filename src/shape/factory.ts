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
  ITransformShape,
  ITransform,
  IConstantMedium,
} from "../models/shape.model";
import { ShapeNotFoundError, InvalidShapeTypeError } from "../utils/errors";
import { AbstractShape } from "./abstract-shape";
import { Box } from "./material-shapes/box";
import { ConstantMedium } from "./material-shapes/constant-medium";
import { MovingSphere } from "./material-shapes/moving-sphere";
import { Plane } from "./material-shapes/plane";
import { Rectangle } from "./material-shapes/rectangle";
import { Sphere } from "./material-shapes/sphere";
import { Rotate } from "./transform-shapes/rotate";
import { TransformShape } from "./transform-shapes/transform-shape";
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

  create(data: IAbstractShape): AbstractShape {
    try {
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
        case "constant-medium":
          const props = <IConstantMedium>data;
          const boundary = this.create(props.boundary);
          return new ConstantMedium(props, this.materialFactory, boundary);
      }
      const tData = <ITransformShape>data;
      const shape = this.create(tData.shape);
      return this.createTransform(tData, shape);
    } catch (err) {
      console.error(`Error while creating shape: ${err.message}`, data);
    }
  }

  createTransform(data: ITransformShape, shape: AbstractShape) {
    switch (data.type) {
      case "translation":
        return new Translate(data as ITranslate, shape);
      case "rotation":
        return new Rotate(data as IRotate, shape);
      case "transform":
        const transforms = (<ITransform>data).transforms;
        let tShape = shape;
        transforms.forEach((transform) => {
          tShape = this.createTransform(<ITransformShape>transform, tShape);
        });
        return tShape;
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
