import { Camera } from "../../core/camera";
import { World } from "../../core/world";

export interface ISampleScene {
  new (): SampleScene;
}

export class SampleScene {
  world: World;
  camera: Camera;

  constructor() {}
}
