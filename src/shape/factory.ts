import { Sphere } from "./sphere";
import { IMovingSphere, IPlane, IShape, ISphere } from "../models/shape.model";
import { InvalidShapeTypeError } from "../utils/errors";
import { Plane } from "./plane";
import { MovingSphere } from "./moving-sphere";

export class ShapeFactory {
  static fromJson(data: IShape) {
    switch (data.type) {
      case "sphere":
        return Sphere.fromJson(data as ISphere);
      case "moving-sphere":
        return MovingSphere.fromJson(data as IMovingSphere);
      case "plane":
        return Plane.fromJson(data as IPlane);
      default:
        throw new InvalidShapeTypeError();
    }
  }
}
