import { ShapeFactory } from "../shape/factory";
import { Intersection, Shape } from "../shape/shape";
import { Ray } from "./ray";

export class World {
  shapes: Shape[] = [];

  constructor() {}

  addShape(...shapes: Shape[]) {
    this.shapes.push(...shapes);
  }

  clearShapes() {
    this.shapes = [];
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    let closest: Intersection = { valid: false, t: tMax };
    this.shapes.forEach((shape) => {
      const intersection = shape.intersect(ray, tMin, closest.t);
      if (intersection.valid) {
        closest = intersection;
      }
    });
    return closest;
  }

  toJson() {
    return {
      shapes: this.shapes.map((s) => s.toJson()),
    };
  }

  static fromJson(data: any) {
    const w = new World();
    for (const shapeData of data.shapes) {
      w.addShape(ShapeFactory.fromJson(shapeData));
    }
    return w;
  }
}
