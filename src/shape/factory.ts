import { Sphere } from "./sphere";
import { Shape } from "./shape";
import { IShape } from "../models/shape.model";
import { InvalidShapeTypeError } from "../utils/errors";

export class ShapeFactory {
  static fromJson(data: IShape) {
    switch (data.type) {
      case "sphere":
        const shape = Sphere.fromJson(data.properties);
        shape.name = data.name;
        return shape;
    }
    throw new InvalidShapeTypeError();
  }
}
