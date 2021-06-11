import { ICheckerTexture, ISolidColorTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Point3, Color } from "../utils";
import { TextureFactory } from "./factory";
import { SolidColorTexture } from "./solid-color";
import { Texture } from "./texture";

export class CheckerTexture extends Texture {
  even: Texture;
  odd: Texture;

  constructor(even: Texture, odd: Texture) {
    super();
    this.odd = odd;
    this.even = even;
  }

  value(uv: UV, p: Point3): Color {
    const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
    if (sines < 0) return this.odd.value(uv, p);
    else return this.even.value(uv, p);
  }

  toJson(): ICheckerTexture {
    return {
      type: "checker",
      even: this.even.toJson(),
      odd: this.odd.toJson(),
    };
  }

  static fromJson(data: ICheckerTexture) {
    const odd = TextureFactory.fromJson(data.odd);
    const even = TextureFactory.fromJson(data.even);
    return new CheckerTexture(odd, even);
  }
}
