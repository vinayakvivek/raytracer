import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { Material } from "../materials/material";
import { IPlane, PlaneProps } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { EPSILON } from "../utils/constants";
import { Intersection, Shape } from "./shape";

export class Plane extends Shape {
  position: Point3;
  normal: Vec3;

  constructor(position: Point3, normal: Vec3, material: Material) {
    super(material);
    this.normal = normal.clone();
    this.position = position.clone();
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const d = ray.direction;
    const denom = this.normal.dot(d);
    if (Math.abs(denom) < EPSILON) {
      // ray is almost parallel to plane, no intersection
      return { valid: false };
    }
    const t = this.position.clone().sub(ray.origin).dot(this.normal) / denom;
    if (t < EPSILON || t < tMin || t > tMax) {
      return { valid: false };
    }
    const n = this.normal.clone();
    let frontFace = true;
    if (denom > 0) {
      n.negate();
      frontFace = false;
    }
    return {
      valid: true,
      p: ray.at(t),
      n,
      frontFace,
      t,
      material: this.material,
    };
  }

  toJson(): IPlane {
    return {
      name: this.name,
      type: "plane",
      properties: {
        normal: this.normal.toJson(),
        position: this.position.toJson(),
        material: this.material.toJson(),
      },
    };
  }

  static fromJson(data: PlaneProps) {
    const material = MaterialFactory.fromJson(data.material);
    const position = Vec3.fromJson(data.position);
    const normal = Vec3.fromJson(data.normal);
    return new Plane(position, normal, material);
  }
}
