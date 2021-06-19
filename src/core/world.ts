import { Intersection } from "../models/intersection.model";
import { AbstractShape } from "../shape/abstract-shape";
import { GroupShape } from "../shape/group";
import { Ray } from "./ray";

export class World {
  group: GroupShape;

  constructor(shapes: AbstractShape[]) {
    this.group = new GroupShape(shapes);
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    return this.group.intersect(ray, tMin, tMax);
  }
}
