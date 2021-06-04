import { Ray } from "../core/ray";
import { Intersection } from "../shape/shape";
import { Color, Point3, Vec3 } from "../utils";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  rayOut?: Ray;
}

export class Material {
  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    return { valid: false };
  }
}
