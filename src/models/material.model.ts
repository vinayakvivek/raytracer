import { Array3 } from "../utils";

export type MaterialType = "lambertian" | "metal" | "dielectric";

export interface IMaterial {
  type: MaterialType;
  properties: any;
}

export interface ILambertianMaterial extends IMaterial {
  type: "lambertian";
  properties: LambertianMaterialProps;
}

export interface LambertianMaterialProps {
  albedo: Array3;
}

export interface IMetalMaterial extends IMaterial {
  type: "metal";
  properties: MetalMaterialProps;
}

export interface MetalMaterialProps {
  albedo: Array3;
  fuzz: number;
}

export interface IDielectricMaterial extends IMaterial {
  type: "dielectric";
  properties: DielectricMaterialProps;
}

export interface DielectricMaterialProps {
  refractiveIndex: number;
}
