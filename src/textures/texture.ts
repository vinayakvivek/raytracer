import { ITexture } from "../models/texture.model";
import { Color, Point3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class Texture {
  value(u: number, v: number, p: Point3): Color {
    throw new UnimplementedError();
  }

  toJson(): ITexture {
    throw new UnimplementedError();
  }
}
