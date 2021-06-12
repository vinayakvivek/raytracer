import {
  ICheckerTexture,
  IImageTexture,
  IPerlinTexture,
  ISolidColorTexture,
  ITexture,
} from "../models/texture.model";
import { InvalidTextureTypeError, TextureNotFoundError } from "../utils/errors";
import { LoadingManager } from "../utils/loading-manager";
import { CheckerTexture } from "./checker";
import { ImageTexture } from "./image";
import { PerlinTexture } from "./perlin";
import { SolidColorTexture } from "./solid-color";
import { Texture } from "./texture";

export type TextureIdMap = {
  [x: number]: Texture;
};

export class TextureFactory {
  textures: TextureIdMap = {};
  loadingManager: LoadingManager;

  constructor(loadingManager: LoadingManager) {
    this.loadingManager = loadingManager;
  }

  getById(id: number): Texture {
    const t = this.textures[id];
    if (!t) {
      throw new TextureNotFoundError(`id: ${id}`);
    }
    return t;
  }

  _createUtil(data: ITexture): Texture {
    switch (data.type) {
      case "solid":
        return new SolidColorTexture(data as ISolidColorTexture);
      case "checker":
        return new CheckerTexture(data as ICheckerTexture, this);
      case "perlin":
        return new PerlinTexture(data as IPerlinTexture);
      case "image":
        return new ImageTexture(data as IImageTexture, this.loadingManager);
      default:
        throw new InvalidTextureTypeError();
    }
  }

  create(data: ITexture): Texture {
    const texture = this._createUtil(data);
    this.textures[data.id] = texture;
    return texture;
  }
}
