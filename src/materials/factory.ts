import { DielectricMaterial } from "./dielectric";
import { LambertianMaterial } from "./lambertian";
import { Material } from "./material";
import { MetalMaterial } from "./metal";

export class MaterialFactory {
  static fromJson(data: any) {
    switch (data.type) {
      case "lambertian":
        return LambertianMaterial.fromJson(data.properties);
      case "metal":
        return MetalMaterial.fromJson(data.properties);
      case "dielectric":
        return DielectricMaterial.fromJson(data.properties);
    }
    return new Material();
  }
}
