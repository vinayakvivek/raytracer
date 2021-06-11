import {
  ICheckerTexture,
  ISolidColorTexture,
  ITexture,
} from "../models/texture.model";
import { InvalidTextureTypeError } from "../utils/errors";
import { CheckerTexture } from "./checker";
import { SolidColorTexture } from "./solid-color";
import { Texture } from "./texture";

export class TextureFactory {
  static fromJson(data: ITexture): Texture {
    switch (data.type) {
      case "solid":
        return SolidColorTexture.fromJson(data as ISolidColorTexture);
      case "checker":
        return CheckerTexture.fromJson(data as ICheckerTexture);
      default:
        throw new InvalidTextureTypeError();
    }
  }
}
