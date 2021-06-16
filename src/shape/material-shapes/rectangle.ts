import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { Intersection, UV } from "../../models/intersection.model";
import { IRectangle } from "../../models/shape.model";
import { Point3, random, Vec3 } from "../../utils";
import { MaterialShape } from "./material-shape";

export class Rectangle extends MaterialShape {
  width: number;
  height: number;

  constructor(props: IRectangle, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    [this.width, this.height] = [props.width, props.height];
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const margin = 0.001;
    return new AABB(
      new Point3(0, 0, -margin),
      new Point3(this.width, this.height, margin)
    );
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const t = -ray.origin.z / ray.direction.z;
    if (t < tMin || t > tMax) {
      return { valid: false };
    }
    const p = ray.at(t);
    const x = p.x;
    const y = p.y;
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return { valid: false };
    }
    const uv: UV = {
      u: x / this.width,
      v: y / this.height,
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
