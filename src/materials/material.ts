import { Ray } from "../core/ray";
import { Color, Point3, Vec3 } from "../utils";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  rayOut?: Ray;
}

export class Material {
  scatter(rayIn: Ray, p: Point3, n: Vec3): Scatter {
    return { valid: false };
  }
}
