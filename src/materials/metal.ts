import { Ray } from "../core/ray";
import { clamp, Color, Point3, Vec3 } from "../utils";
import { Material, Scatter } from "./material";

export class MetalMaterial extends Material {
  albedo: Color;
  fuzz: number;

  constructor(albedo: Color, fuzz = 0.0) {
    super();
    this.albedo = albedo;
    this.fuzz = clamp(fuzz, 0, 1);
  }

  // r = v - 2 * dot(v, n) * n
  _reflect(v: Vec3, n: Vec3) {
    return v.clone().subScaled(n, 2 * v.dot(n));
  }

  scatter(rayIn: Ray, p: Point3, n: Color): Scatter {
    if (rayIn.direction.dot(n) > 0) {
      return { valid: false };
    }

    // r = r - fuzz * randomUnitSphereVector
    const reflectedDir = this._reflect(rayIn.direction, n).addScaled(
      Vec3.randomInUnitSphere(),
      this.fuzz
    );
    return {
      valid: true,
      rayOut: new Ray(p, reflectedDir),
      attenuation: this.albedo,
    };
  }
}
