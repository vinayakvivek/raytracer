import { Array3 } from "../utils";
import { IMaterial } from "./material.model";
import { IShape } from "./shape.model";
import { ITexture } from "./texture.model";

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
  textures: ITexture[];
  materials: IMaterial[];
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
