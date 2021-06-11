import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { Material } from "../materials/material";
import { TimeInterval } from "../models/scene.model";
import { IShape } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

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

export class Shape {
  name: string = "foo-shape";
  material: Material;
  boundingBox: AABB;

  constructor(material: Material) {
    this.material = material;
  }

  getUV(p: Point3): UV {
    throw new UnimplementedError();
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    throw new UnimplementedError();
  }

  toJson(): IShape {
    throw new UnimplementedError();
  }
}
