import { Ray } from "../core/ray";
import { Intersection } from "../shape/shape";
import { Point3, Color, random } from "../utils";
import { Material, Scatter } from "./material";

const reflectance = (cosine: number, refIdx: number) => {
  // Use Schlick's approximation for reflectance.
  let r0 = (1 - refIdx) / (1 + refIdx);
  r0 = r0 * r0;
  return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
};

export class DielectricMaterial extends Material {
  refractiveIndex: number;

  constructor(refractiveIndex: number) {
    super();
    this.refractiveIndex = refractiveIndex;
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
      rayOut: new Ray(p, direction),
      attenuation: new Color(1, 1, 1),
    };
  }

  toJson() {
    return {
      type: "dielectric",
      properties: {
        refractiveIndex: this.refractiveIndex,
      },
    };
  }

  static fromJson(data: any) {
    return new DielectricMaterial(data.refractiveIndex);
  }
}
