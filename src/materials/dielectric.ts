import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { IDielectricMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
import { Point3, Color, random } from "../utils";
import { Material } from "./material";

const reflectance = (cosine: number, refIdx: number) => {
  // Use Schlick's approximation for reflectance.
  let r0 = (1 - refIdx) / (1 + refIdx);
  r0 = r0 * r0;
  return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
};

export class DielectricMaterial extends Material {
  refractiveIndex: number;

  constructor(props: IDielectricMaterial) {
    super(props);
    this.refractiveIndex = props.refractiveIndex;
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    const { n, p, frontFace } = intersection;
    const refractionRatio = frontFace
      ? 1 / this.refractiveIndex
      : this.refractiveIndex;

    const cosTheta = Math.min(-rayIn.direction.dot(n), 1.0);
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

    const direction = rayIn.direction.clone();
    const cannotRefract = refractionRatio * sinTheta > 1.0;
    if (
      cannotRefract ||
      reflectance(cosTheta, this.refractiveIndex) > random()
    ) {
      // total internal reflection
      direction.reflect(n);
    } else {
      direction.refract(n, refractionRatio);
    }
    return {
      valid: true,
      rayOut: new Ray(p, direction, rayIn.time),
      attenuation: new Color(1, 1, 1),
    };
  }
}
