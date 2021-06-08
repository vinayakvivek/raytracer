import { IMaterial } from "../models/material.model";
import { InvalidMaterialTypeError } from "../utils/errors";
import { DielectricMaterial } from "./dielectric";
import { LambertianMaterial } from "./lambertian";
import { Material } from "./material";
import { MetalMaterial } from "./metal";

export class MaterialFactory {
  static fromJson(data: IMaterial) {
    switch (data.type) {
      case "lambertian":
        return LambertianMaterial.fromJson(data.properties);
      case "metal":
        return MetalMaterial.fromJson(data.properties);
      case "dielectric":
        return DielectricMaterial.fromJson(data.properties);
    }
    throw new InvalidMaterialTypeError();
  }
}
