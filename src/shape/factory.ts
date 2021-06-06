import { Sphere } from "./sphere";
import { Shape } from "./shape";

export class ShapeFactory {
  static fromJson(data: any) {
    switch (data.type) {
      case "sphere":
        const shape = Sphere.fromJson(data.properties);
        shape.name = data.name;
        return shape;
    }
    return new Shape();
  }
}
