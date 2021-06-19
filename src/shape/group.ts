import { AABB } from "../core/aabb";
import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { AbstractShape } from "./abstract-shape";

export class GroupShape extends AbstractShape {
  shapes: AbstractShape[];

  constructor(shapes: AbstractShape[]) {
    super();
    this.shapes = shapes;
    this.boundingBox = this._boundingBox();
  }

  _boundingBox() {
    // if at-least one shape has no bounding box, no box for group
    if (!this.shapes.length || this.shapes.find((s) => !s.boundingBox))
      return null;
    let box = this.shapes[0].boundingBox;
    for (let i = 1; i < this.shapes.length; ++i) {
      box = AABB.surroundingBox(box, this.shapes[i].boundingBox);
    }
    return box;
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    let closest: Intersection = { valid: false, t: tMax };
    this.shapes.forEach((shape) => {
      const intersection = shape.intersect(ray, tMin, closest.t);
      if (intersection.valid) {
        closest = intersection;
      }
    });
    return closest;
  }
}
