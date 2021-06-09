import { IScene } from "../models/scene.model";
import { Camera } from "./camera";
import { World } from "./world";

export class Scene {
  world: World;
  camera: Camera;

  constructor() {}

  parse(data: IScene) {
    this.world = World.fromJson(data.world);
    this.camera = Camera.fromJson(data.camera);
    console.log(this.world);
  }

  toJson(): IScene {
    return {
      camera: this.camera.toJson(),
      world: this.world.toJson(),
    };
  }
}
