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

    const groundMat = this.diffuseMaterial([0.2, 0.2, 0.2]);
    this.shape("plane", groundMat, {});

    const red = this.diffuseMaterial([0.9, 0.1, 0.1]);
    const s = 1.5;
    const box = this.shape(
      "box",
      red,
      { size: [s, 0.5, 3] },
      [this.translate(2, 2)],
      true
    );

    const lightMat = this.light([7, 7, 7]);
    const s1 = this.shape("sphere", lightMat, {
      center: [2, 2, 2],
      radius: 0.5,
    });

    const black = this.solidTexture([0, 0, 0]);
    this.constantMedium(0.1, black, box);
  }
}
