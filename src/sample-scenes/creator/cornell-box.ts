import { Canvas } from "../../core/canvas";
import { WorkerRenderer } from "../../renderer/worker-renderer";
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
      this.solidTexture([7, 7, 7]),
      {}
    );
    const glass = this.glassMaterial();
    const metal = this.metalMaterial([0.3, 0.5, 0.7]);
    const metalWallMat = this.metalMaterial([0.73, 0.73, 0.73]);

    const size = 555;
    const props = { width: size, height: size, plane: 1 };
    this.shape("rectangle", green, props, [this.translate(0)]);
    this.shape("rectangle", red, props, [this.translate(555)]);
    props.plane = 2;
    this.shape("rectangle", metalWallMat, props);
    this.shape("rectangle", white, props, [this.translate(0, 555)]);
    props.plane = 0;
    this.shape("rectangle", white, props, [this.translate(0, 0, 555)]);

    // light
    this.shape("rectangle", light, { width: 330, height: 305, plane: 2 }, [
      this.translate(113, 554, 127),
    ]);

    // this.shape("box", metal, { size: [165, 165, 165] }, [
    //   this.translate(160, 0, 65),
    //   this.rotate("y", -18),
    // ]);
    // this.shape("box", metal, { size: [165, 330, 165] }, [
    //   this.translate(-165 / 2, 0, -165 / 2),
    //   this.rotate("y", 45),
    //   this.rotate("x", -30),
    //   this.translate(265 + 165 / 2, 10, 295 + 165 / 2),
    // ]);

    this.shape("sphere", metal, {
      center: [350, 150, 350],
      radius: 150,
    });
    this.shape("sphere", glass, {
      center: [150, 100, 150],
      radius: 100,
    });
  }

  renderScene(canvas: Canvas) {
    const sceneData = this.exportJson();
    const renderer = new WorkerRenderer(canvas, sceneData);
    renderer.render();
  }
}
