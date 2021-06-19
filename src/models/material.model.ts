import { Array3 } from "../utils";
import { IEntity } from "./entity.model";
import { ITexture } from "./texture.model";

export type MaterialType =
  | "lambertian"
  | "metal"
  | "dielectric"
  | "diffuse-light"
  | "isotropic";

export interface IMaterial extends IEntity {
  type: MaterialType;
}

export interface ILambertianMaterial extends IMaterial {
  type: "lambertian";
  textureId: number;
}
export interface IMetalMaterial extends IMaterial {
  type: "metal";
  textureId: number;
  fuzz?: number;
}
export interface IDielectricMaterial extends IMaterial {
  type: "dielectric";
  refractiveIndex: number;
}

export interface IDiffuseLightMaterial extends IMaterial {
  type: "diffuse-light";
  textureId: number;
}

export interface IIsotropicMaterial extends IMaterial {
  type: "isotropic";
  textureId: number;
}
