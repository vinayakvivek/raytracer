import { IPerlinTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { perlinNoise } from "../utils/perlin";
import { Texture } from "./texture";

export class PerlinTexture extends Texture {
  scale = 1.0;

  constructor(scale: number) {
    super();
    this.scale = scale;
  }

  value(uv: UV, p: Point3): Color {
    // no issue if p is updated
    return new Color(1, 1, 1).multScalar(perlinNoise(p.multScalar(this.scale)));
  }

  toJson(): IPerlinTexture {
    return {
      type: "perlin",
      scale: this.scale,
    };
  }

  static fromJson(data: IPerlinTexture) {
    return new PerlinTexture(data.scale);
  }
}
