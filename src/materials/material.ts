import { Entity } from "../core/entity";
import { Ray } from "../core/ray";
import { IMaterial } from "../models/material.model";
import { Intersection, UV } from "../shape/shape";
import { Color, Point3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  rayOut?: Ray;
}

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

  toJson(): IMaterial {
    throw new UnimplementedError();
  }
}
