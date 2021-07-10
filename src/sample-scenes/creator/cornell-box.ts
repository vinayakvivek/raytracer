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
    const lightMaterial = this.material(
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
    const lw = 105;
    const lh = 130;
    this.shape(
      "rectangle",
      lightMaterial,
      { width: 105, height: 130, plane: 2 },
      [
        // { type: "flip-face" },
        this.rotate("x", -90),
        this.translate(213, 500, 227),
      ],
      false,
      true
    );

    const aluminum = this.metalMaterial([0.8, 0.85, 0.88], 0.0);
    this.shape("box", aluminum, { size: [165, 330, 165] }, [
      this.translate(180, 0, 350),
      this.rotate("y", 15),
    ]);

    this.shape("box", white, { size: [165, 165, 165] }, [
      this.translate(130, 0, 40),
      this.rotate("y", -15),
    ]);
  }
}
