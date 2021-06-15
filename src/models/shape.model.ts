import { Array3 } from "../utils";
import { IEntity } from "./entity.model";
import { IMaterial } from "./material.model";
import { TimeInterval } from "./scene.model";

export type TransformShapeType = "translation" | "rotation";

export type ShapeType =
  | "sphere"
  | "moving-sphere"
  | "plane"
  | "rectangle"
  | "box";

export interface IAbstractShape {
  type: TransformShapeType | ShapeType;
}

export interface ITransformShape extends IAbstractShape {
  type: TransformShapeType;
  shape: IAbstractShape;
}

export interface ITranslate extends ITransformShape {
  type: "translation";
  x?: number;
  y?: number;
  z?: number;
}

export interface IMaterialShape extends IAbstractShape {
  type: ShapeType;
  unbounded?: boolean;
  materialId: number;
}
export interface ISphere extends IMaterialShape {
  type: "sphere";
  center: Array3;
  radius: number;
}

export interface IMovingSphere extends IMaterialShape {
  type: "moving-sphere";
  startCenter: Array3;
  endCenter: Array3;
  radius: number;
  time: TimeInterval;
}

export interface IPlane extends IMaterialShape {
  type: "plane";
  normal: Array3;
  position: Array3;
}

export interface IRectangle extends IMaterialShape {
  type: "rectangle";
  width: number;
  height: number;
}

export interface IBox extends IMaterialShape {
  type: "box";
  size: Array3;
}
