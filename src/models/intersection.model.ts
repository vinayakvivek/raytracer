import { Ray } from "../core/ray";
import { Material } from "../materials/material";
import { Point3, Vec3 } from "../utils";

export interface UV {
  u: number;
  v: number;
}

export interface Intersection {
  valid: boolean;
  p?: Point3;
  n?: Vec3;
  frontFace?: boolean;
  t?: number;
  uv?: UV;
  material?: Material;
}

export const setFaceNormal = (intersection: Intersection, direction: Vec3) => {
  intersection.frontFace = true;
  const n = intersection.n;
  if (direction.dot(n) > 0) {
    n.negate();
    intersection.frontFace = false;
  }
};
