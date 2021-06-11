import { Ray } from "../core/ray";
import { ILambertianMaterial } from "../models/material.model";
import { Intersection } from "../shape/shape";
import { TextureFactory } from "../textures/factory";
import { Texture } from "../textures/texture";
import { Color, Point3, Vec3 } from "../utils";
import { Material, Scatter } from "./material";

export class LambertianMaterial extends Material {
  albedo: Texture;

  constructor(albedo: Texture) {
    super();
    this.albedo = albedo;
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p, uv } = intersection;
    // const targetDir = n.add(Vec3.randomInUnitSphere());  // simple diffuse
    // const targetDir = n.add(Vec3.random().normalize()); // true lambertian
    // const targetDir = Vec3.randomInHemisphere(n); // diffuse (hemispherical)
    let scatterDir = n.add(Vec3.random().normalize());

    // check if direction is exactly opposite to normal
    if (scatterDir.isNearZero()) {
      scatterDir = n;
    }

    const scatteredRay = new Ray(p, scatterDir, rayIn.time);
    return {
      valid: true,
      attenuation: this.albedo.value(uv, p),
      rayOut: scatteredRay,
    };
  }

  toJson(): ILambertianMaterial {
    return {
      type: "lambertian",
      properties: {
        albedo: this.albedo.toJson(),
      },
    };
  }

  static fromJson(data: ILambertianMaterial) {
    const albedo = TextureFactory.fromJson(data.properties.albedo);
    return new LambertianMaterial(albedo);
  }
}
