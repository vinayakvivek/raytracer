import { Entity } from "../core/entity";
import { Ray } from "../core/ray";
import { Intersection, UV } from "../models/intersection.model";
import { IMaterial } from "../models/material.model";
import { Scatter } from "../models/scatter.model";
import { Color, Point3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class Material extends Entity {
  constructor(props: IMaterial) {
    super(props);
  }

  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    throw new UnimplementedError();
  }

  emitted(uv: UV, p: Point3): Color {
    return new Color();
  }
}
