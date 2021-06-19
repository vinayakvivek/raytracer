import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { IsotropicMaterial } from "../../materials/isotropic";
import { Intersection } from "../../models/intersection.model";
import { IIsotropicMaterial } from "../../models/material.model";
import { IConstantMedium } from "../../models/shape.model";
import { random, Vec3 } from "../../utils";
import { AbstractShape } from "../abstract-shape";
import { MaterialShape } from "./material-shape";

export class ConstantMedium extends MaterialShape {
  boundary: AbstractShape;
  negInvDensity: number;
  phaseFunction: IsotropicMaterial;

  constructor(
    props: IConstantMedium,
    materialFactory: MaterialFactory,
    boundary: AbstractShape
  ) {
    super(props, materialFactory, false);
    this.phaseFunction = <IsotropicMaterial>materialFactory.create({
      type: "isotropic",
      textureId: props.textureId,
    } as IIsotropicMaterial);
    this.negInvDensity = -1 / props.density;
    this.boundary = boundary;
    this.boundingBox = boundary.boundingBox;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const enableDebug = true;
    const debugging = enableDebug && random() < 0.0001;

    const rec1 = this.boundary.intersect(ray, -Infinity, Infinity);
    if (!rec1.valid) return this._noIntersection;

    const rec2 = this.boundary.intersect(ray, rec1.t + 0.0001, Infinity);
    // if (debugging) console.log(rec1, rec2);

    // if (!rec2.valid) return this._noIntersection;
    rec2.t = rec1.t + 100;

    // if (debugging) console.log(`tMin: ${tMin}, tMax: ${tMax}`);

    if (rec1.t < tMin) rec1.t = tMin;
    if (rec2.t > tMax) rec2.t = tMax;

    if (rec1.t > rec2.t) return this._noIntersection;

    if (rec1.t < 0) rec1.t = 0;

    const p1 = ray.at(rec1.t);
    const p2 = ray.at(rec2.t);

    const distanceInsideBoundary = p2.clone().sub(p1).length();
    const rayLength = distanceInsideBoundary / (rec2.t - rec1.t);
    const hitDistance = this.negInvDensity * Math.log(random());

    if (hitDistance > distanceInsideBoundary) return this._noIntersection;

    const rec: Intersection = { valid: true };
    rec.t = rec1.t + hitDistance / rayLength;
    rec.p = ray.at(rec.t);

    if (debugging) console.log({ hitDistance, t: rec.t, p: rec.p });

    rec.n = new Vec3(1, 0, 0); // arbitrary
    rec.frontFace = true;
    rec.material = this.phaseFunction;
    return rec;
  }
}
