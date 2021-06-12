import { ISolidColorTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { Texture } from "./texture";

export class SolidColorTexture extends Texture {
  color: Color;

  constructor(props: ISolidColorTexture) {
    super(props);
    this.color = Color.fromJson(props.color);
  }

  value(uv: UV, p: Point3): Color {
    return this.color;
  }
}
