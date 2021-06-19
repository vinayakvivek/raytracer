import { UV } from "../models/intersection.model";
import { ICheckerTexture } from "../models/texture.model";
import { Point3, Color } from "../utils";
import { TextureFactory } from "./factory";
import { Texture } from "./texture";

export class CheckerTexture extends Texture {
  even: Texture;
  odd: Texture;

  constructor(props: ICheckerTexture, factory: TextureFactory) {
    super(props);
    this.odd = factory.getById(props.oddId);
    this.even = factory.getById(props.evenId);
  }

  value(uv: UV, p: Point3): Color {
    const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
    if (sines < 0) return this.odd.value(uv, p);
    else return this.even.value(uv, p);
  }
}
