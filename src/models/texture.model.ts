import { Array3 } from "../utils";

export type TextureType = "solid";

export interface ITexture {
  type: TextureType;
}

export interface ISolidColorTexture extends ITexture {
  color: Array3;
}
