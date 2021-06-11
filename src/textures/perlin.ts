import { IPerlinTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { perlinNoise } from "../utils/perlin";
import { Texture } from "./texture";

export class PerlinTexture extends Texture {
  value(uv: UV, p: Point3): Color {
    return new Color(1, 1, 1).multScalar(perlinNoise(p));
  }

  toJson(): IPerlinTexture {
    return {
      type: "perlin",
    };
  }

  static fromJson(data: IPerlinTexture) {
    return new PerlinTexture();
  }
}
