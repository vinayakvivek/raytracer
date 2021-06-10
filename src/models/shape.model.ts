import { Array3 } from "../utils";
import { IMaterial } from "./material.model";
import { TimeInterval } from "./scene.model";

export type ShapeType = "sphere" | "moving-sphere" | "plane";

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

export interface IMovingSphere extends IShape {
  type: "moving-sphere";
  properties: ShapeProps & {
    startCenter: Array3;
    endCenter: Array3;
    radius: number;
    time: TimeInterval;
  };
}

export interface IPlane extends IShape {
  type: "plane";
  properties: ShapeProps & {
    normal: Array3;
    position: Array3;
  };
}
