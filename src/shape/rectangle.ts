import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { IRectangle } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { Point2 } from "../utils/vec2";
import { Intersection, Shape, UV } from "./shape";

export class Rectangle extends Shape {
  min: Point2;
  max: Point2;
  k: number; // plane z = k
  // width: number;
  // height: number;
  // center: Point3;

  constructor(props: IRectangle, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    const cx = props.center[0];
    const cy = props.center[1];
    const hw = props.width / 2;
    const hh = props.height / 2;
    this.min = new Point2(cx - hw, cy - hh);
    this.max = new Point2(cx + hw, cy + hh);
    this.k = props.center[2];
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    return new AABB(
      new Point3(this.min.x, this.min.y, this.k - 0.001),
      new Point3(this.max.x, this.max.y, this.k + 0.001)
    );
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const t = (this.k - ray.origin.z) / ray.direction.z;
    if (t < tMin || t > tMax) {
      return { valid: false };
    }
    const p = ray.at(t);
    const x = p.x;
    const y = p.y;
    if (x < this.min.x || x > this.max.x || y < this.min.y || y > this.max.y) {
      return { valid: false };
    }
    const uv: UV = {
      u: (x - this.min.x) / (this.max.x - this.min.x),
      v: (y - this.min.y) / (this.max.y - this.min.y),
    };
    const n = new Vec3(0, 0, 1);
    let frontFace = true;
    if (ray.direction.dot(n) > 0) {
      n.negate();
      frontFace = false;
    }
    return { valid: true, t, p, n, frontFace, material: this.material, uv };
  }
}
