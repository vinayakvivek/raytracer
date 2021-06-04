import { Ray } from "../core/ray";
import { Intersection } from "../shape/shape";
import { Point3, Color } from "../utils";
import { Material, Scatter } from "./material";

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

    const refractedDir = rayIn.direction.clone().refract(n, refractionRatio);
    return {
      valid: true,
      rayOut: new Ray(p, refractedDir),
      attenuation: new Color(1, 1, 1),
    };
  }
}
