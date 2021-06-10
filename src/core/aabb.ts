import { Point3 } from "../utils";
import { Ray } from "./ray";

export class AABB {
  min: Point3;
  max: Point3;

  constructor(min: Point3, max: Point3) {
    this.min = min;
    this.max = max;
  }

  hit(ray: Ray, tMin: number, tMax: number): boolean {
    const min = this.min.toJson();
    const max = this.max.toJson();
    const d = ray.direction.toJson();
    const o = ray.origin.toJson();
    for (let i = 0; i < 3; ++i) {
      const invD = 1 / d[i];
      let t0 = (min[i] - o[i]) * invD;
      let t1 = (max[i] - o[i]) * invD;
      if (invD < 0) {
        [t0, t1] = [t1, t0];
      }
      tMin = t0 > tMin ? t0 : tMin;
      tMax = t1 < tMax ? t1 : tMax;
      if (tMax < tMax) {
        return false;
      }
    }
    return true;
  }
}
