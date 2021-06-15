import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import {
  Intersection,
  setFaceNormal,
  UV,
} from "../../models/intersection.model";
import { IBox } from "../../models/shape.model";
import { Point3, Vec3 } from "../../utils";
import { UnimplementedError } from "../../utils/errors";
import { MaterialShape } from "./material-shape";

export class Box extends MaterialShape {
  size: Vec3;

  constructor(props: IBox, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.size = Vec3.fromJson(props.size);
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const margin = 0.01;
    return new AABB(
      new Point3().subScalar(margin),
      this.size.clone().addScalar(margin)
    );
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const max = this.size.toJson();
    const d = ray.direction.toJson();
    const o = ray.origin.toJson();
    let side = 0;
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
        return { valid: false };
      }
    }
    const t = tMin;
    const p = ray.at(t);
    const n = new Vec3(0, 0, 0);
    const uv: UV = { u: 0, v: 0 }; // TODO: update
    if (side == 0) {
      n.x = p.x > 0.01 ? 1 : -1;
    } else if (side == 1) {
      n.y = p.y > 0.01 ? 1 : -1;
    } else {
      n.z = p.z > 0.01 ? 1 : -1;
    }
    const rec = { valid: true, t, p, n, material: this.material, uv };
    setFaceNormal(rec, ray.direction);
    return rec;
  }
}
