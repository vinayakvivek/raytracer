import { SceneCreator } from "./scene-creator";

export class CornellBox extends SceneCreator {
  /**
   * config for nice image
   *  Aspect Ratio: 1.0
   *  Image width: 600
   *  Samples per pixel: 200
   */

  constructor() {
    super();
    this.camera = {
      position: [278, 278, -800],
      lookAt: [278, 278, 0],
      up: [0, 1, 0],
      vfov: 40,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };
    this.background = [0, 0, 0];
  }

  generate() {
    const red = this.diffuseMaterial([0.65, 0.05, 0.05]);
    const white = this.diffuseMaterial([0.73, 0.73, 0.73]);
    const green = this.diffuseMaterial([0.12, 0.45, 0.15]);
    const light = this.material(
      "diffuse-light",
      this.solidTexture([15, 15, 15]),
      {}
    );
    const size = 555;
    const props = { width: size, height: size, plane: 1 };
    this.shape("rectangle", red, props, [this.translate(0)]);
    this.shape("rectangle", green, props, [this.translate(555)]);
    props.plane = 2;
    this.shape("rectangle", white, props);
    this.shape("rectangle", white, props, [this.translate(0, 555)]);
    props.plane = 0;
    this.shape("rectangle", white, props, [this.translate(0, 0, 555)]);

    // light
    this.shape("rectangle", light, { width: 105, height: 130, plane: 2 }, [
      this.translate(213, 554, 227),
    ]);

    this.shape("box", white, { size: [165, 330, 165] }, [
      this.translate(180, 0, 350),
      this.rotate("y", 15),
    ]);

    this.shape("box", white, { size: [165, 165, 165] }, [
      this.translate(130, 0, 40),
      this.rotate("y", -18),
    ]);
  }
}
