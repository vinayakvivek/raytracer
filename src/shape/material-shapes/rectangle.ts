import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import {
  Intersection,
  setFaceNormal,
  UV,
} from "../../models/intersection.model";
import { IRectangle } from "../../models/shape.model";
import { Point3, random, Vec3 } from "../../utils";
import { MaterialShape } from "./material-shape";

export class Rectangle extends MaterialShape {
  width: number;
  height: number;
  plane = 0; // 0: xy, 1: yz, 2: zx
  normal: Vec3;

  constructor(props: IRectangle, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    [this.width, this.height] = [props.width, props.height];
    this.plane = props.plane || 0;
    const n = [0, 0, 0];
    n[(this.plane + 2) % 3] = 1;
    this.normal = Vec3.fromJson(n);

    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const margin = 0.001;
    switch (this.plane) {
      case 0:
        return new AABB(
          new Point3(0, 0, -margin),
          new Point3(this.width, this.height, margin)
        );
      case 1:
        return new AABB(
          new Point3(-margin, 0, 0),
          new Point3(margin, this.width, this.height)
        );
      case 2:
        return new AABB(
          new Point3(0, -margin, 0),
          new Point3(this.height, margin, this.width)
        );
    }
  }

  _getT(ray: Ray) {
    switch (this.plane) {
      case 0:
        return -ray.origin.z / ray.direction.z;
      case 1:
        return -ray.origin.x / ray.direction.x;
      case 2:
        return -ray.origin.y / ray.direction.y;
    }
  }

  _getXY(p: Point3) {
    switch (this.plane) {
      case 0:
        return [p.x, p.y];
      case 1:
        return [p.y, p.z];
      case 2:
        return [p.z, p.x];
    }
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const t = this._getT(ray);
    if (t < tMin || t > tMax) {
      return { valid: false };
    }
    const p = ray.at(t);
    const [x, y] = this._getXY(p);
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return { valid: false };
    }
    const uv: UV = {
      u: x / this.width,
      v: y / this.height,
    };
    const n = this.normal;
    const rec = { valid: true, t, p, n, material: this.material, uv };
    setFaceNormal(rec, ray.direction);
    return rec;
  }
}
