import { Ray } from "../core/ray";
import { MaterialFactory } from "../materials/factory";
import { Material } from "../materials/material";
import { TimeInterval } from "../models/scene.model";
import { IMovingSphere } from "../models/shape.model";
import { Point3, Vec3 } from "../utils";
import { Shape } from "./shape";

export class MovingSphere extends Shape {
  startCenter: Point3;
  endCenter: Point3;
  radius: number;

  startTime: number;
  timeDiff: number;
  moveDir: Vec3;

  constructor(
    startCenter: Point3,
    endCenter: Point3,
    radius: number,
    time: TimeInterval,
    material: Material
  ) {
    super(material);
    this.startCenter = startCenter;
    this.endCenter = endCenter;
    this.startTime = time.start;
    this.radius = radius;
    this.moveDir = endCenter.clone().sub(startCenter);
    this.timeDiff = time.end - time.start;
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

  toJson(): IMovingSphere {
    return {
      name: this.name,
      type: "moving-sphere",
      properties: {
        startCenter: this.startCenter.toJson(),
        endCenter: this.endCenter.toJson(),
        time: {
          start: this.startTime,
          end: this.startTime + this.timeDiff,
        },
        radius: this.radius,
        material: this.material.toJson(),
      },
    };
  }

  static fromJson(data: IMovingSphere) {
    const props = data.properties;
    const material = MaterialFactory.fromJson(props.material);
    const sc = Point3.fromJson(props.startCenter);
    const ec = Point3.fromJson(props.endCenter);
    return new MovingSphere(sc, ec, props.radius, props.time, material);
  }
}
