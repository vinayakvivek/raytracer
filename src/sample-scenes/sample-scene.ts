import { Camera } from "../core/camera";
import { Scene } from "../core/scene";

export class SampleScene {
  scene: Scene;
  camera: Camera;

  constructor() {
    this.scene = new Scene();
  }
}
