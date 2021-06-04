import { Ray } from "../core/ray";
import { Color, Point3, Vec3 } from "../utils";
import { Material, Scatter } from "./material";

export class MetalMaterial extends Material {
  albedo: Color;

  constructor(albedo: Color) {
    super();
    this.albedo = albedo;
  }

  _reflect(v: Vec3, n: Vec3) {
    return v.clone().subScaled(n, 2 * v.dot(n));
  }

  scatter(rayIn: Ray, p: Point3, n: Color): Scatter {
    if (rayIn.direction.dot(n) > 0) {
      return { valid: false };
    }
    const reflectedDir = this._reflect(rayIn.direction, n);
    return {
      valid: true,
      rayOut: new Ray(p, reflectedDir),
      attenuation: this.albedo,
    };
  }
}
