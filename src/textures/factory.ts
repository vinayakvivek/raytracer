import { ISolidColorTexture, ITexture } from "../models/texture.model";
import { InvalidTextureTypeError } from "../utils/errors";
import { SolidColorTexture } from "./solid-color";

export class TextureFactory {
  static fromJson(data: ITexture) {
    switch (data.type) {
      case "solid":
        return SolidColorTexture.fromJson(data as ISolidColorTexture);
      default:
        throw new InvalidTextureTypeError();
    }
  }
}
