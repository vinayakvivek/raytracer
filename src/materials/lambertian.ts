import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { ILambertianMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
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

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p, uv } = intersection;
    // let scatterDir = n.clone().add(Vec3.randomInUnitSphere());  // simple diffuse
    // let scatterDir = n.clone().add(Vec3.random().normalize()); // true lambertian
    // let scatterDir = Vec3.randomInHemisphere(n); // diffuse (hemispherical)
    // let scatterDir = n.clone().add(Vec3.random().normalize());

    // // check if direction is exactly opposite to normal
    // if (scatterDir.isNearZero()) {
    //   scatterDir = n;
    // }

    const uvw = new ONB(n);
    const direction = uvw.local(Vec3.randomCosineDirection());
    const scatteredRay = new Ray(p, direction, rayIn.time);
    return {
      valid: true,
      attenuation: this.albedo.value(uv, p),
      pdf: uvw.w.dot(scatteredRay.direction) / Math.PI,
      rayOut: scatteredRay,
    };
  }

  scatteringPdf(rayIn: Ray, intersection: Intersection, rayOut: Ray) {
    const cosine = intersection.n.dot(rayOut.direction);
    return cosine < 0 ? 0 : cosine / Math.PI;
  }
}
