import { Array3 } from "../utils";
import { Array2 } from "../utils/vec2";
import { IEntity } from "./entity.model";
import { IMaterial } from "./material.model";
import { TimeInterval } from "./scene.model";

export type ShapeType = "sphere" | "moving-sphere" | "plane" | "rectangle";

export interface IShape extends IEntity {
  type: ShapeType;
  unbounded?: boolean;
  materialId: number;
}
export interface ISphere extends IShape {
  type: "sphere";
  center: Array3;
  radius: number;
}

export interface IMovingSphere extends IShape {
  type: "moving-sphere";
  startCenter: Array3;
  endCenter: Array3;
  radius: number;
  time: TimeInterval;
}

export interface IPlane extends IShape {
  type: "plane";
  normal: Array3;
  position: Array3;
}

export interface IRectangle extends IShape {
  type: "rectangle";
  width: number;
  height: number;
  center: Array3;
}
