import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { setFaceNormal, UV } from "../../models/intersection.model";
import { ISphere } from "../../models/shape.model";
import { Point3, Vec3 } from "../../utils";
import { ONB } from "../../utils/onb";
import { MaterialShape } from "./material-shape";

export class Sphere extends MaterialShape {
  center: Point3;
  radius: number;

  constructor(props: ISphere, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.center = Point3.fromJson(props.center || [0, 0, 0]);
    this.radius = props.radius;
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _boundingBox(): AABB {
    const r = this.radius;
    const min = this.center.clone().sub(new Vec3(r, r, r));
    const max = this.center.clone().add(new Vec3(r, r, r));
    return new AABB(min, max);
  }

  getUV(p: Point3): UV {
    const theta = Math.acos(-p.y);
    const phi = Math.atan2(-p.z, p.x) + Math.PI;
    return {
      u: phi / (2 * Math.PI),
      v: theta / Math.PI,
    };
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
    const uv = this.getUV(n);
    const rec = {
      valid: true,
      t,
      p,
      n,
      material: this.material,
      uv,
      frontFace: true,
    };
    setFaceNormal(rec, ray.direction);
    return rec;
  }

  normal(p: Point3) {
    return p.clone().sub(this.center).divScalar(this.radius);
  }

  pdfValue(o: Point3, v: Vec3): number {
    const rec = this.intersect(new Ray(o, v, 0), 0.001, Infinity);
    if (!rec.valid) {
      return 0;
    }
    const r = this.radius;
    const d = this.center.clone().sub(o).lengthSq();
    const cosThetaMax = Math.sqrt(1 - (r * r) / d);
    const solidAngle = 2 * Math.PI * (1 - cosThetaMax);
    return 1 / solidAngle;
  }

  random(o: Vec3) {
    const direction = this.center.clone().sub(o);
    const distSq = direction.lengthSq();
    const uvw = new ONB(direction);
    return uvw.local(Vec3.randomToSphere(this.radius, distSq));
  }
}
