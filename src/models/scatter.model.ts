import { Ray } from "../core/ray";
import { Color } from "../utils";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  rayOut?: Ray;
  pdf?: number;
}
