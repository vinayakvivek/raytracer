import {
  ICheckerTexture,
  IImageTexture,
  IPerlinTexture,
  ISolidColorTexture,
  ITexture,
} from "../models/texture.model";
import { InvalidTextureTypeError } from "../utils/errors";
import { CheckerTexture } from "./checker";
import { ImageTexture } from "./image";
import { PerlinTexture } from "./perlin";
import { SolidColorTexture } from "./solid-color";
import { Texture } from "./texture";

export class TextureFactory {
  static fromJson(data: ITexture): Texture {
    switch (data.type) {
      case "solid":
        return SolidColorTexture.fromJson(data as ISolidColorTexture);
      case "checker":
        return CheckerTexture.fromJson(data as ICheckerTexture);
      case "perlin":
        return PerlinTexture.fromJson(data as IPerlinTexture);
      case "image":
        return ImageTexture.fromJson(data as IImageTexture);
      default:
        throw new InvalidTextureTypeError();
    }
  }
}
