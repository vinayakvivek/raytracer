import { Array3 } from "../utils";
import { IEntity } from "./entity.model";

export type TextureType = "solid" | "checker" | "perlin" | "image";

export interface ITexture extends IEntity {
  type: TextureType;
}

export interface ISolidColorTexture extends ITexture {
  type: "solid";
  color: Array3;
}

export interface ICheckerTexture extends ITexture {
  type: "checker";
  oddId: number;
  evenId: number;
}

export interface IPerlinTexture extends ITexture {
  type: "perlin";
  scale: number;
}

export interface IImageTexture extends ITexture {
  type: "image";
  src: string;
}
