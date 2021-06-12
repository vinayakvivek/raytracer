import { Entity } from "../core/entity";
import { ITexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class Texture extends Entity {
  constructor(props: ITexture) {
    super(props);
  }

  value(uv: UV, p: Point3): Color {
    throw new UnimplementedError();
  }

  toJson(): ITexture {
    throw new UnimplementedError();
  }
}
