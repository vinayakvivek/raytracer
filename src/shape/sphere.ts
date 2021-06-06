import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { Material } from "../materials/material";
import { Point3 } from "../utils";
import { Shape } from "./shape";

class Sphere extends Shape {
  name: String = "foo-shape";
  center: Point3;
  radius: number;

  constructor(center: Point3, radius: number, material: Material) {
    super();
    this.material = material;
    this.center = center.clone();
    this.radius = radius;
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

  toJson() {
    return {
      name: this.name,
      type: "sphere",
      properties: {
        center: this.center,
        radius: this.radius,
        material: this.material.toJson(),
      },
    };
  }

  static fromJson(data: any) {
    let { center, radius, material } = data;
    material = MaterialFactory.fromJson(material);
    center = Point3.fromJson(center);
    return new Sphere(center, radius, material);
  }
}

export { Sphere };
