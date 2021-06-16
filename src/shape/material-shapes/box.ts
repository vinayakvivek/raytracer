import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import {
  Intersection,
  setFaceNormal,
  UV,
} from "../../models/intersection.model";
import { IBox } from "../../models/shape.model";
import { Point3, random, Vec3 } from "../../utils";
import { UnimplementedError } from "../../utils/errors";
import { MaterialShape } from "./material-shape";

const max = Math.max;
const min = Math.min;
const isEqual = (x1: number, x2: number) => Math.abs(x1 - x2) < Number.EPSILON;

export class Box extends MaterialShape {
  size: Vec3;

  constructor(props: IBox, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.size = Vec3.fromJson(props.size);
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    return new AABB(new Point3(), this.size.clone());
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const max = this.size.toArray();
    const d = ray.direction.toArray();
    const o = ray.origin.toArray();
    let side = -1;
    for (let i = 0; i < 3; ++i) {
      const invD = 1 / d[i];
      let t0 = -o[i] * invD;
      let t1 = (max[i] - o[i]) * invD;
      if (invD < 0) {
        [t0, t1] = [t1, t0];
      }
      if (t0 > tMin) {
        tMin = t0;
        side = i;
      }
      tMax = t1 < tMax ? t1 : tMax;
      if (tMax < tMin) {
        return this._noIntersection;
      }
    }

    if (side < 0) {
      return this._noIntersection;
    }

    const t = tMin;
    const p = ray.at(t);
    const n = new Vec3(0, 0, 0);
    let uv: UV;
    if (side == 0) {
      n.x = p.x > 0.001 ? 1 : -1;
      uv = { u: p.y / max[1], v: p.z / max[2] };
    } else if (side == 1) {
      n.y = p.y > 0.001 ? 1 : -1;
      uv = { u: p.x / max[0], v: p.z / max[2] };
    } else {
      n.z = p.z > 0.001 ? 1 : -1;
      uv = { u: p.x / max[0], v: p.y / max[1] };
    }
    const rec = { valid: true, t, p, n, material: this.material, uv };
    setFaceNormal(rec, ray.direction);
    return rec;
  }
}
