import { Camera } from "../core/camera";
import { Scene } from "../core/scene";

export interface ISampleScene {
  new (): SampleScene;
}

export class SampleScene {
  scene: Scene;
  camera: Camera;

  constructor() {
    this.scene = new Scene();
  }
}
