import {
  IDielectricMaterial,
  ILambertianMaterial,
  IMaterial,
  IMetalMaterial,
} from "../models/material.model";
import { InvalidMaterialTypeError } from "../utils/errors";
import { DielectricMaterial } from "./dielectric";
import { LambertianMaterial } from "./lambertian";
import { MetalMaterial } from "./metal";

export class MaterialFactory {
  static fromJson(data: IMaterial) {
    switch (data.type) {
      case "lambertian":
        return LambertianMaterial.fromJson(data as ILambertianMaterial);
      case "metal":
        return MetalMaterial.fromJson(data as IMetalMaterial);
      case "dielectric":
        return DielectricMaterial.fromJson(data as IDielectricMaterial);
      default:
        throw new InvalidMaterialTypeError();
    }
  }
}
