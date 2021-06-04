import { Ray } from "../core/ray";
import { Material } from "../materials/material";
import { Point3, Vec3 } from "../utils";

export interface Intersection {
  valid: boolean;
  p?: Point3;
  n?: Vec3;
  t?: number;
  material?: Material;
}

export class Shape {
  material: Material;

  constructor(material: Material) {
    this.material = material;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    return { valid: false };
  }
}
