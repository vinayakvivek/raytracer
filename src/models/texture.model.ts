import { Array3 } from "../utils";

export type TextureType = "solid" | "checker";

export interface ITexture {
  type: TextureType;
}

export interface ISolidColorTexture extends ITexture {
  color: Array3;
}

export interface ICheckerTexture extends ITexture {
  odd: ITexture;
  even: ITexture;
}
