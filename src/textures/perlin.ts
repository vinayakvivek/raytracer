import { IPerlinTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { perlinNoise, perlinNoiseTurb } from "../utils/perlin";
import { Texture } from "./texture";

export class PerlinTexture extends Texture {
  scale = 1.0;

  constructor(props: IPerlinTexture) {
    super(props);
    this.scale = props.scale || 1.0;
  }

  value(uv: UV, p: Point3): Color {
    // no issue if p is updated
    // const noise = 0.5 * (1 + perlinNoise(p.multScalar(this.scale)));
    // const noise = perlinNoiseTurb(p.multScalar(this.scale));
    const noise =
      0.5 * (1 + Math.sin(this.scale * p.z + 10 * perlinNoiseTurb(p)));
    return new Color(1, 1, 1).multScalar(noise);
  }
}
