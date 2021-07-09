import { Ray } from "../../core/ray";
import { Intersection, setFaceNormal } from "../../models/intersection.model";
import { IFlipFace } from "../../models/shape.model";
import { AbstractShape } from "../abstract-shape";
import { TransformShape } from "./transform-shape";

export class FlipFace extends TransformShape {
  constructor(props: IFlipFace, shape: AbstractShape) {
    super(props, shape);
    this.boundingBox = shape.boundingBox;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    const rec = this.shape.intersect(ray, tMin, tMax);
    if (rec.valid) {
      // invert front face
      rec.frontFace = !rec.frontFace;
      // if (Math.random() < 0.001) {
      //   console.log("flip", rec.frontFace);
      // }
    }
    return rec;
  }
}
