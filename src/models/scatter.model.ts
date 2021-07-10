import { Ray } from "../core/ray";
import { PDF } from "../pdf/pdf";
import { Color } from "../utils";

export interface Scatter {
  valid: boolean;
  attenuation?: Color;
  pdf?: PDF;
  isSpecular?: boolean;
  specularRay?: Ray;
}
