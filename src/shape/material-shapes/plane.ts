import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { Intersection } from "../../models/intersection.model";
import { IPlane } from "../../models/shape.model";
import { Point3, Vec3 } from "../../utils";
import { EPSILON } from "../../utils/constants";
import { MaterialShape } from "./material-shape";

export class Plane extends MaterialShape {
  position: Point3;
  normal: Vec3;

  constructor(props: IPlane, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.normal = Vec3.fromJson(props.normal);
    this.position = Point3.fromJson(props.position);
    this.boundingBox = null;
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
}
