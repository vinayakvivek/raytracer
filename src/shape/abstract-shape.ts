import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { Intersection, UV } from "../models/intersection.model";
import { Point3, Vec3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class AbstractShape {
  boundingBox: AABB;

  constructor() {}

  getUV(p: Point3): UV {
    throw new UnimplementedError();
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    throw new UnimplementedError();
  }

  pdfValue(o: Point3, v: Vec3): number {
    throw new UnimplementedError();
  }

  random(o: Vec3): Vec3 {
    throw new UnimplementedError();
  }

  get _noIntersection() {
    return { valid: false };
  }
}
