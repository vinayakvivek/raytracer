import { Ray } from "../core/ray";
import { Intersection } from "../shape/shape";
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

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p } = intersection;
    if (rayIn.direction.dot(n) > 0) {
      return { valid: false };
    }

    // r = r - fuzz * randomUnitSphereVector
    const reflectedDir = rayIn.direction
      .clone()
      .reflect(n)
      .addScaled(Vec3.randomInUnitSphere(), this.fuzz);
    return {
      valid: true,
      rayOut: new Ray(p, reflectedDir),
      attenuation: this.albedo,
    };
  }
}
