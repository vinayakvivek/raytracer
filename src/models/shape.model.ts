import { Array3 } from "../utils";
import { IMaterial } from "./material.model";

export type ShapeType = "sphere" | "plane";

export interface IShape {
  name: string;
  type: ShapeType;
  properties: ShapeProps;
}

export interface ShapeProps {
  material: IMaterial;
}

export interface ISphere extends IShape {
  type: "sphere";
  properties: ShapeProps & {
    center: Array3;
    radius: number;
  };
}

export interface IPlane extends IShape {
  type: "plane";
  properties: ShapeProps & {
    normal: Array3;
    position: Array3;
  };
}
