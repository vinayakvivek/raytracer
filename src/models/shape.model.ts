import { Array3 } from "../utils";
import { IMaterial } from "./material.model";

export type ShapeType = "sphere" | "plane";

export interface IShape {
  name: string;
  type: ShapeType;
  properties: any;
}

export interface ISphere extends IShape {
  type: "sphere";
}

export interface SphereProps {
  center: Array3;
  radius: number;
  material: IMaterial;
}
