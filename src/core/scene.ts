import { Camera } from "./camera";
import { World } from "./world";

export class Scene {
  world: World;
  camera: Camera;

  constructor() {}

  parse(data: any) {
    this.world = World.fromJson(data.world);
    this.camera = Camera.fromJson(data.camera);
  }

  toJson() {
    return {
      camera: this.camera.toJson(),
      world: this.world.toJson(),
    };
  }
}
