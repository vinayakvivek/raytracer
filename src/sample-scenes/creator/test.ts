import { SceneCreator } from "./scene-creator";

export class TestSceneCreator extends SceneCreator {
  generate() {
    this.camera = {
      position: [5, 5, 5],
      lookAt: [0, 0, 0],
      up: [0, 1, 0],
      vfov: 50,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };

    const black = this.diffuseMaterial([0.2, 0.2, 0.2]);
    this.shape("plane", black, {});

    const red = this.diffuseMaterial([0.9, 0.1, 0.1]);
    const s = 6;
    this.shape("box", red, { size: [s, s, s] }, [this.translate(0)]);

    const lightMat = this.light([7, 7, 7]);
    this.shape("sphere", lightMat, { center: [2, 2, 2], radius: 0.5 });
  }
}
