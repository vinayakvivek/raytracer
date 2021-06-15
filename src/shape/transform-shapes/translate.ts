import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { Intersection, setFaceNormal } from "../../models/intersection.model";
import { ITranslate } from "../../models/shape.model";
import { Vec3 } from "../../utils";
import { ShapeFactory } from "../factory";
import { TransformShape } from "./transform-shape";

export class Translate extends TransformShape {
  offset: Vec3;

  constructor(props: ITranslate, shapeFactory: ShapeFactory) {
    super(props, shapeFactory);
    this.offset = new Vec3(props.x || 0, props.y || 0, props.z || 0);
    this.boundingBox = this._boundingBox();
  }

  _boundingBox() {
    const box = this.shape.boundingBox;
    if (!box) return null;
    return new AABB(
      box.min.clone().add(this.offset),
      box.max.clone().add(this.offset)
    );
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const movedRay = new Ray(
      ray.origin.clone().sub(this.offset),
      ray.direction,
      ray.time
    );
    const intersection = this.shape.intersect(movedRay, tMin, tMax);
    if (!intersection.valid) {
      return intersection; // { valid: false }
    }

    intersection.p.add(this.offset);
    setFaceNormal(intersection, movedRay.direction); // !! required?
    return intersection;
  }
}
