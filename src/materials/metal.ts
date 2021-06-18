import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { IMetalMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
import { TextureFactory } from "../textures/factory";
import { Texture } from "../textures/texture";
import { clamp, Color, Point3, Vec3 } from "../utils";
import { Material } from "./material";

export class MetalMaterial extends Material {
  albedo: Texture;
  fuzz: number;

  constructor(props: IMetalMaterial, textureFactory: TextureFactory) {
    super(props);
    this.albedo = textureFactory.getById(props.textureId);
    this.fuzz = clamp(props.fuzz || 0, 0, 1);
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p, uv } = intersection;
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
      attenuation: this.albedo.value(uv, p),
    };
  }
}
