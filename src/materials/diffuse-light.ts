import { Material } from "./material";
import { IDiffuseLightMaterial } from "../models/material.model";
import { TextureFactory } from "../textures/factory";
import { Color, Point3 } from "../utils";
import { Texture } from "../textures/texture";
import { Ray } from "../core/ray";
import { Intersection, UV } from "../models/intersection.model";
import { Scatter } from "../models/scatter.model";

export class DiffuseLight extends Material {
  color: Texture;

  constructor(props: IDiffuseLightMaterial, textureFactory: TextureFactory) {
    super(props);
    this.color = textureFactory.getById(props.textureId);
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    return { valid: false };
  }

  emitted(uv: UV, p: Point3, rec: Intersection): Color {
    return rec.frontFace ? this.color.value(uv, p) : new Color(0, 0, 0);
  }
}
