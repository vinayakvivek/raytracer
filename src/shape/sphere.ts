import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { Material } from "../materials/material";
import { TimeInterval } from "../models/scene.model";
import { ISphere } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { Shape } from "./shape";

export class Sphere extends Shape {
  center: Point3;
  radius: number;

  constructor(
    center: Point3,
    radius: number,
    material: Material,
    unbounded = false
  ) {
    super(material);
    this.center = center.clone();
    this.radius = radius;
    this.boundingBox = unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const r = this.radius;
    const min = this.center.clone().sub(new Vec3(r, r, r));
    const max = this.center.clone().add(new Vec3(r, r, r));
    return new AABB(min, max);
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
    return { valid: true, t, p, n, frontFace, material: this.material };
  }

  normal(p: Point3) {
    return p.clone().sub(this.center).divScalar(this.radius);
  }

  toJson(): ISphere {
    return {
      name: this.name,
      type: "sphere",
      properties: {
        center: this.center.toJson(),
        radius: this.radius,
        material: this.material.toJson(),
      },
    };
  }

  static fromJson(data: ISphere) {
    const props = data.properties;
    const material = MaterialFactory.fromJson(props.material);
    const center = Point3.fromJson(props.center);
    return new Sphere(center, props.radius, material, !!data.unbounded);
  }
}
