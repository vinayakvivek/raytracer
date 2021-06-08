import { Sphere } from "./sphere";
import { IShape, PlaneProps, SphereProps } from "../models/shape.model";
import { InvalidShapeTypeError } from "../utils/errors";
import { Plane } from "./plane";

export class ShapeFactory {
  static fromJson(data: IShape) {
    let shape;
    switch (data.type) {
      case "sphere":
        shape = Sphere.fromJson(data.properties as SphereProps);
        break;
      case "plane":
        shape = Plane.fromJson(data.properties as PlaneProps);
        break;
      default:
        throw new InvalidShapeTypeError();
    }
    shape.name = data.name;
    return shape;
  }
}
