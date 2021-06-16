import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { Intersection, setFaceNormal } from "../../models/intersection.model";
import { IRotateY } from "../../models/shape.model";
import { degToRad, Point3, Vec3 } from "../../utils";
import { ShapeFactory } from "../factory";
import { TransformShape } from "./transform-shape";

export class RotateY extends TransformShape {
  angle: number;
  sinTheta: number;
  cosTheta: number;

  constructor(props: IRotateY, shapeFactory: ShapeFactory) {
    super(props, shapeFactory);
    this.angle = degToRad(props.angle);
    this.sinTheta = Math.sin(this.angle);
    this.cosTheta = Math.cos(this.angle);
    this.boundingBox = this._boundingBox();
  }

  _boundingBox() {
    const box = this.shape.boundingBox;
    if (!box) return null;

    let min = new Point3(Infinity, Infinity, Infinity);
    let max = new Point3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const x = i * box.max.x + (1 - i) * box.min.x;
          const y = j * box.max.y + (1 - j) * box.min.y;
          const z = k * box.max.z + (1 - k) * box.min.z;

          const newx = this.cosTheta * x + this.sinTheta * z;
          const newz = -this.sinTheta * x + this.cosTheta * z;

          const tester = new Vec3(newx, y, newz);
          min = Vec3.min(min, tester);
          max = Vec3.max(max, tester);
        }
      }
    }
    return new AABB(min, max);
  }

  _rotated(v: Vec3, inverse = false) {
    const res = v.clone();
    const sinTheta = this.sinTheta * (inverse ? -1 : 1);
    res.x = this.cosTheta * v.x - sinTheta * v.z;
    res.z = sinTheta * v.x + this.cosTheta * v.z;
    return res;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const o = this._rotated(ray.origin);
    const d = this._rotated(ray.direction);

    const rotatedRay = new Ray(o, d, ray.time);
    const intersection = this.shape.intersect(rotatedRay, tMin, tMax);
    if (!intersection.valid) {
      return intersection;
    }

    intersection.p = this._rotated(intersection.p, true);
    intersection.n = this._rotated(intersection.n, true);
    setFaceNormal(intersection, rotatedRay.direction);
    return intersection;
  }
}
