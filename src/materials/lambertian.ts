import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { ILambertianMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
import { CosinePDF } from "../pdf/cosine-pdf";
import { TextureFactory } from "../textures/factory";
import { Texture } from "../textures/texture";
import { Vec3 } from "../utils";
import { ONB } from "../utils/onb";
import { Material } from "./material";

export class LambertianMaterial extends Material {
  albedo: Texture;

  constructor(props: ILambertianMaterial, textureFactory: TextureFactory) {
    super(props);
    this.albedo = textureFactory.getById(props.textureId);
  }

  scatter(rayIn: Ray, rec: Intersection): Scatter {
    // let scatterDir = n.clone().add(Vec3.randomInUnitSphere());  // simple diffuse
    // let scatterDir = n.clone().add(Vec3.random().normalize()); // true lambertian
    // let scatterDir = Vec3.randomInHemisphere(n); // diffuse (hemispherical)
    // let scatterDir = n.clone().add(Vec3.random().normalize());

    // // check if direction is exactly opposite to normal
    // if (scatterDir.isNearZero()) {
    //   scatterDir = n;
    // }
    return {
      valid: true,
      attenuation: this.albedo.value(rec.uv, rec.p),
      pdf: new CosinePDF(rec.n),
      isSpecular: false,
    };
  }

  scatteringPdf(rayIn: Ray, rec: Intersection, rayOut: Ray) {
    const cosine = rec.n.dot(rayOut.direction);
    return cosine < 0 ? 0 : cosine / Math.PI;
  }
}
