import { Array3 } from "../utils";
import { IShape } from "./shape.model";

export interface ICamera {
  position: Array3;
  lookAt: Array3;
  up: Array3;
  vfov: number;
  aperture: number;
  focusDist: number;
  time: TimeInterval;
}

export interface IWorld {
  shapes: IShape[];
}

export interface IScene {
  camera: ICamera;
  world: IWorld;
}

export interface TimeInterval {
  start: number;
  end: number;
}
