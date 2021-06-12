import { Ray } from "../core/ray";
import { IMetalMaterial } from "../models/material.model";
import { Intersection } from "../shape/shape";
import { clamp, Color, Point3, Vec3 } from "../utils";
import { Material, Scatter } from "./material";

export class MetalMaterial extends Material {
  albedo: Color;
  fuzz: number;

  constructor(props: IMetalMaterial) {
    super(props);
    this.albedo = Color.fromJson(props.albedo);
    this.fuzz = clamp(props.fuzz, 0, 1);
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
      rayOut: new Ray(p, reflectedDir, rayIn.time),
      attenuation: this.albedo,
    };
  }
}
