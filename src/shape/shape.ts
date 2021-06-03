import { Ray } from "../core/ray";
import { Point3, Vec3 } from "../utils";

export interface Intersection {
  valid: boolean,
  p?: Point3,
  n?: Vec3,
  t?: number,
}

export class Shape {
  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    return { valid: false };
  }
}