import { Array3 } from "../utils";

export type TextureType = "solid" | "checker" | "perlin";

export interface ITexture {
  type: TextureType;
}

export interface ISolidColorTexture extends ITexture {
  type: "solid";
  color: Array3;
}

export interface ICheckerTexture extends ITexture {
  type: "checker";
  odd: ITexture;
  even: ITexture;
}

export interface IPerlinTexture extends ITexture {
  type: "perlin";
}
