import { Array3 } from "../utils";

export type MaterialType = "lambertian" | "metal" | "dielectric";

export interface IMaterial {
  type: MaterialType;
  properties: any;
}

export interface ILambertianMaterial extends IMaterial {
  type: "lambertian";
  properties: {
    albedo: Array3;
  };
}
export interface IMetalMaterial extends IMaterial {
  type: "metal";
  properties: {
    albedo: Array3;
    fuzz: number;
  };
}
export interface IDielectricMaterial extends IMaterial {
  type: "dielectric";
  properties: {
    refractiveIndex: number;
  };
}
