import { ISolidColorTexture } from "../models/texture.model";
import { Color, Point3 } from "../utils";
import { Texture } from "./texture";

export class SolidColorTexture extends Texture {
  color: Color;

  constructor(color: Color) {
    super();
    this.color = color;
  }

  value(u: number, v: number, p: Point3): Color {
    return this.color;
  }

  toJson(): ISolidColorTexture {
    return {
      color: this.color.toJson(),
    };
  }

  static fromJson(data: ISolidColorTexture) {
    const c = Color.fromJson(data.color);
    return new SolidColorTexture(c);
  }
}
