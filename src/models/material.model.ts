import { Array3 } from "../utils";
import { IEntity } from "./entity.model";
import { ITexture } from "./texture.model";

export type MaterialType = "lambertian" | "metal" | "dielectric";

export interface IMaterial extends IEntity {
  type: MaterialType;
}

export interface ILambertianMaterial extends IMaterial {
  type: "lambertian";
  textureId: number;
}
export interface IMetalMaterial extends IMaterial {
  type: "metal";
  albedo: Array3;
  fuzz: number;
}
export interface IDielectricMaterial extends IMaterial {
  type: "dielectric";
  refractiveIndex: number;
}
