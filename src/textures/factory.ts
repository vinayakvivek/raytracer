import {
  ICheckerTexture,
  IPerlinTexture,
  ISolidColorTexture,
  ITexture,
} from "../models/texture.model";
import { InvalidTextureTypeError } from "../utils/errors";
import { CheckerTexture } from "./checker";
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
      default:
        throw new InvalidTextureTypeError();
    }
  }
}
