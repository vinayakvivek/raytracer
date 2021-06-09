import { Ray } from "../core/ray";
import { IMaterial } from "../models/material.model";
import { Intersection } from "../shape/shape";
import { Color } from "../utils";
import { UnimplementedError } from "../utils/errors";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  rayOut?: Ray;
}

export class Material {
  scatter(rayIn: Ray, intersection: Intersection): Scatter {
    throw new UnimplementedError();
  }

  toJson(): IMaterial {
    throw new UnimplementedError();
  }
}
