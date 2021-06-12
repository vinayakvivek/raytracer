import {
  IDielectricMaterial,
  ILambertianMaterial,
  IMaterial,
  IMetalMaterial,
} from "../models/material.model";
import { TextureFactory } from "../textures/factory";
import {
  InvalidMaterialTypeError,
  MaterialNotFoundError,
} from "../utils/errors";
import { DielectricMaterial } from "./dielectric";
import { LambertianMaterial } from "./lambertian";
import { Material } from "./material";
import { MetalMaterial } from "./metal";

export type MaterialIdMap = {
  [x: number]: Material;
};
export class MaterialFactory {
  materials: MaterialIdMap = {};
  textureFactory: TextureFactory;

  constructor(textureFactory: TextureFactory) {
    this.textureFactory = textureFactory;
  }

  getById(id: number): Material {
    if (id in this.materials) {
      return this.materials[id];
    }
    throw new MaterialNotFoundError(`id: ${id}`);
  }

  _createUtil(data: IMaterial) {
    switch (data.type) {
      case "lambertian":
        return new LambertianMaterial(
          data as ILambertianMaterial,
          this.textureFactory
        );
      case "metal":
        return new MetalMaterial(data as IMetalMaterial, this.textureFactory);
      case "dielectric":
        return new DielectricMaterial(data as IDielectricMaterial);
      default:
        throw new InvalidMaterialTypeError();
    }
  }

  create(data: IMaterial): Material {
    const material = this._createUtil(data);
    this.materials[material.id] = material;
    return material;
  }
}
