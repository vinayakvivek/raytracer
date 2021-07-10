import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { Intersection, setFaceNormal } from "../../models/intersection.model";
import { IRotate } from "../../models/shape.model";
import { degToRad, Point3, Vec3 } from "../../utils";
import { AbstractShape } from "../abstract-shape";
import { ShapeFactory } from "../factory";
import { TransformShape } from "./transform-shape";

export class Rotate extends TransformShape {
  angle: number;
  sinTheta: number;
  cosTheta: number;
  _rotated: (v: Vec3, inverse: boolean) => Vec3;

  constructor(props: IRotate, shape: AbstractShape) {
    super(props, shape);
    this.angle = degToRad(props.angle);
    this.sinTheta = Math.sin(this.angle);
    this.cosTheta = Math.cos(this.angle);
    const axis = props.axis || "y"; // default axis of rotation is Y
    const rotations = {
      x: this._rotatedByX,
      y: this._rotatedByY,
      z: this._rotatedByZ,
    };
    this._rotated = rotations[axis];
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

          const tester = this._rotated(new Vec3(x, y, z), true);
          min = Vec3.min(min, tester);
          max = Vec3.max(max, tester);
        }
      }
    }
    return new AABB(min, max);
  }

  _rotatedByX(v: Vec3, inverse = false) {
    const res = v.clone();
    const sinTheta = this.sinTheta * (inverse ? -1 : 1);
    res.y = this.cosTheta * v.y + sinTheta * v.z;
    res.z = -sinTheta * v.y + this.cosTheta * v.z;
    return res;
  }

  _rotatedByY(v: Vec3, inverse = false) {
    const res = v.clone();
    const sinTheta = this.sinTheta * (inverse ? -1 : 1);
    res.x = this.cosTheta * v.x - sinTheta * v.z;
    res.z = sinTheta * v.x + this.cosTheta * v.z;
    return res;
  }

  _rotatedByZ(v: Vec3, inverse = false) {
    const res = v.clone();
    const sinTheta = this.sinTheta * (inverse ? -1 : 1);
    res.x = this.cosTheta * v.x - sinTheta * v.y;
    res.y = sinTheta * v.x + this.cosTheta * v.y;
    return res;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const o = this._rotated(ray.origin, false);
    const d = this._rotated(ray.direction, false);

    const rotatedRay = new Ray(o, d, ray.time);
    const intersection = this.shape.intersect(rotatedRay, tMin, tMax);
    if (intersection.valid) {
      intersection.p = this._rotated(intersection.p, true);
      intersection.n = this._rotated(intersection.n, true);
      setFaceNormal(intersection, rotatedRay.direction);
    }
    return intersection;
  }

  pdfValue(o: Point3, v: Vec3): number {
    const ro = this._rotated(o, false);
    const rv = this._rotated(v, false);
    return this.shape.pdfValue(ro, rv);
  }

  random(o: Vec3) {
    const ro = this._rotated(o, false);
    return this._rotated(this.shape.random(ro), true);
  }
}
