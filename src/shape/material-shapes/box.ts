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
    const margin = 0.1;
    return new AABB(
      new Point3().subScalar(margin),
      this.size.clone().addScalar(margin)
    );
  }

  getT(ray: Ray) {
    const dir = ray.direction;
    const origin = ray.origin;
    const invD = new Vec3();
    invD.x = 1 / dir.x;
    invD.y = 1 / dir.y;
    invD.z = 1 / dir.z;

    let t1 = -origin.x * invD.x;
    let t2 = (this.size.x - origin.x) * invD.x;
    if (t2 < t1) {
      [t1, t2] = [t2, t1];
    }

    let t3 = -origin.y * invD.y;
    let t4 = (this.size.y - origin.y) * invD.y;
    if (t4 < t3) {
      [t3, t4] = [t4, t3];
    }

    let t5 = -origin.z * invD.z;
    let t6 = (this.size.z - origin.z) * invD.z;
    if (t6 < t5) {
      [t5, t6] = [t6, t5];
    }

    const tmin = max(max(t1, t3), t5);
    const tmax = min(min(t2, t4), t6);

    // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
    if (tmax < 0) {
      return null;
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax) {
      return null;
    }

    let side = -1;
    if (isEqual(tmin, t1)) {
      side = 0;
    } else if (isEqual(tmin, t3)) {
      side = 1;
    } else {
      side = 2;
    }

    return [tmin, side];
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const tRes = this.getT(ray);
    if (!tRes) {
      return this._noIntersection;
    }

    const [t, side] = tRes;
    if (!t || t < tMin || t > tMax) {
      return this._noIntersection;
    }

    const p = ray.at(t);
    const n = new Vec3(0, 0, 0);
    const uv: UV = { u: 0, v: 0 }; // TODO: update
    if (side == 0) {
      n.x = p.x > 0.001 ? 1 : -1;
    } else if (side == 1) {
      n.y = p.y > 0.001 ? 1 : -1;
    } else {
      n.z = p.z > 0.001 ? 1 : -1;
    }
    const rec = { valid: true, t, p, n, material: this.material, uv };
    setFaceNormal(rec, ray.direction);
    return rec;
  }
}
