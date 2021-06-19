import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { IMovingSphere } from "../../models/shape.model";
import { Point3, Vec3 } from "../../utils";
import { MaterialShape } from "./material-shape";

export class MovingSphere extends MaterialShape {
  startCenter: Point3;
  endCenter: Point3;
  radius: number;

  startTime: number;
  endTime: number;
  timeDiff: number;
  moveDir: Vec3;

  constructor(props: IMovingSphere, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.startCenter = Point3.fromJson(props.startCenter);
    this.endCenter = Point3.fromJson(props.endCenter);
    this.startTime = props.time.start;
    this.endTime = props.time.end;
    this.radius = props.radius;
    this.moveDir = this.endCenter.clone().sub(this.startCenter);
    this.timeDiff = this.endTime - this.startTime;

    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const r = this.radius;
    const offset = new Vec3(r, r, r);
    const c0 = this.center(this.startTime);
    const c1 = this.center(this.endTime);
    const b0 = new AABB(c0.clone().sub(offset), c0.clone().add(offset));
    const b1 = new AABB(c1.clone().sub(offset), c1.clone().add(offset));
    return AABB.surroundingBox(b0, b1);
  }

  // return t, n
  intersect(ray: Ray, tMin: number, tMax: number) {
    const center = this.center(ray.time);
    const oc = ray.origin.clone().sub(center);
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
    const n = p.clone().sub(center).divScalar(this.radius);
    let frontFace = true;
    // check normal direction
    if (ray.direction.dot(n) > 0) {
      n.negate();
      frontFace = false;
    }
    return { valid: true, t, p, n, frontFace, material: this.material };
  }

  center(time: number) {
    const center = this.startCenter.clone();
    return center.addScaled(
      this.moveDir,
      (time - this.startTime) / this.timeDiff
    );
  }
}
