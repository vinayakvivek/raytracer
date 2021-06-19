import { Entity } from "../core/entity";
import { UV } from "../models/intersection.model";
import { ITexture } from "../models/texture.model";
import { Color, Point3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class Texture extends Entity {
  constructor(props: ITexture) {
    super(props);
  }

  value(uv: UV, p: Point3): Color {
    throw new UnimplementedError();
  }
}
