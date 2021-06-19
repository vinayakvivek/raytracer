import { Array3 } from "../utils";
import { IMaterial } from "./material.model";
import { IAbstractShape } from "./shape.model";
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
  shapes: IAbstractShape[];
}

export interface IScene {
  camera: ICamera;
  world: IWorld;
  background?: Array3;
}

export interface TimeInterval {
  start: number;
  end: number;
}
