import { Canvas } from "../../core/canvas";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { SceneCreator } from "./scene-creator";

export class TestSceneCreator extends SceneCreator {
  constructor() {
    super();
  }

  generate() {
    this.camera = {
      position: [5, 2, 5],
      lookAt: [0, 0, 0],
      up: [0, 1, 0],
      vfov: 50,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };

    const groundMat = this.diffuseMaterial([0.2, 0.2, 0.2]);
    this.shape("plane", groundMat, {});

    const texture = this.imageTexture("./static/textures/earth.jpg");
    const earthMat = this.material("lambertian", texture, {});
    this.shape("sphere", earthMat, { center: [0, 1, 0], radius: 1 });
  }
}
