import { Ray } from "../core/ray";
import { UV, Intersection } from "../models/intersection.model";
import { IIsotropicMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
import { TextureFactory } from "../textures/factory";
import { Texture } from "../textures/texture";
import { Point3, Color, Vec3 } from "../utils";
import { Material } from "./material";

export class IsotropicMaterial extends Material {
  albedo: Texture;

  constructor(props: IIsotropicMaterial, textureFactory: TextureFactory) {
    super(props);
    this.albedo = textureFactory.getById(props.textureId);
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p, uv } = intersection;
    return {
      valid: true,
      attenuation: this.albedo.value(uv, p),
      specularRay: new Ray(p, Vec3.randomInUnitSphere(), rayIn.time),
    };
  }
}
