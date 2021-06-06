import { Ray } from "../core/ray";
import { Material } from "../materials/material";
import { Point3, Vec3 } from "../utils";
import { Sphere } from "./sphere";

export interface Intersection {
  valid: boolean;
  p?: Point3;
  n?: Vec3;
  frontFace?: boolean;
  t?: number;
  material?: Material;
}

export class Shape {
  material: Material;

  constructor() {}

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    return { valid: false };
  }

  toJson() {
    return {};
  }
}
