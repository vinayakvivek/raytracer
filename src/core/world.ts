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
}
