import { Sphere } from "./sphere";
import { IPlane, IShape, ISphere } from "../models/shape.model";
import { InvalidShapeTypeError } from "../utils/errors";
import { Plane } from "./plane";

export class ShapeFactory {
  static fromJson(data: IShape) {
    switch (data.type) {
      case "sphere":
        return Sphere.fromJson(data as ISphere);
      case "plane":
        return Plane.fromJson(data as IPlane);
      default:
        throw new InvalidShapeTypeError();
    }
  }
}
