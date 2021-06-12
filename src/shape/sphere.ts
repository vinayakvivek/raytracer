import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { ISphere } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { Shape, UV } from "./shape";

export class Sphere extends Shape {
  center: Point3;
  radius: number;

  constructor(props: ISphere, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.center = Point3.fromJson(props.center);
    this.radius = props.radius;
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const r = this.radius;
    const min = this.center.clone().sub(new Vec3(r, r, r));
    const max = this.center.clone().add(new Vec3(r, r, r));
    return new AABB(min, max);
  }

  getUV(p: Point3): UV {
    const theta = Math.acos(-p.y);
    const phi = Math.atan2(-p.z, p.x) + Math.PI;
    return {
      u: phi / (2 * Math.PI),
      v: theta / Math.PI,
    };
  }

  // return t, n
  intersect(ray: Ray, tMin: number, tMax: number) {
    const oc = ray.origin.clone().sub(this.center);
    const a = ray.direction.dot(ray.direction);
    const halfB = oc.dot(ray.direction);
    const c = oc.dot(oc) - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) {
      return { valid: false };
    }
    const sqrtD = Math.sqrt(discriminant);
    let t = (-halfB - sqrtD) / a;
    if (t < tMin || t > tMax) {
      // smaller root is invalid
      t = (-halfB + sqrtD) / a;
      if (t < tMin || t > tMax) {
        // both invalid
        return { valid: false };
      }
    }
    const p = ray.at(t);
    const n = this.normal(p);
    let frontFace = true;
    // check normal direction
    if (ray.direction.dot(n) > 0) {
      n.negate();
      frontFace = false;
    }
    const uv = this.getUV(n);
    return { valid: true, t, p, n, frontFace, material: this.material, uv };
  }

  normal(p: Point3) {
    return p.clone().sub(this.center).divScalar(this.radius);
  }
}
