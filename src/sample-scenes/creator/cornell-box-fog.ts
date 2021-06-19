import { Canvas } from "../../core/canvas";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { WorkerRenderer } from "../../renderer/worker-renderer";
import { SceneCreator } from "./scene-creator";

export class CornellBoxFogSceneCreator extends SceneCreator {
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
    const blue = this.diffuseMaterial([0.2, 0.5, 0.9]);

    const size = 555;
    const props = { width: size, height: size, plane: 1 };
    this.shape("rectangle", green, props, [this.translate(0)]);
    this.shape("rectangle", red, props, [this.translate(555)]);
    props.plane = 2;
    this.shape("rectangle", white, props);
    this.shape("rectangle", white, props, [this.translate(0, 555)]);
    props.plane = 0;
    this.shape("rectangle", white, props, [this.translate(0, 0, 555)]);

    // light
    this.shape("rectangle", light, { width: 200, height: 200, plane: 2 }, [
      this.translate(170, 554, 127),
    ]);

    this.shape("box", blue, { size: [165, 165, 165] }, [
      this.translate(160, 0, 65),
      this.rotate("y", -18),
    ]);
    const box2 = this.shape(
      "box",
      blue,
      { size: [165, 330, 165] },
      [
        this.translate(-165 / 2, 0, -165 / 2),
        this.rotate("y", 30),
        this.rotate("x", -10),
        this.translate(265 + 165 / 2, 100, 295 + 165 / 2),
      ],
      true
    );

    const sphere = this.shape(
      "sphere",
      red,
      { center: [0, 0, 0], radius: 100 },
      [this.rotate("y", 100), this.translate(400, 300, 200)],
      true
    );
    const fogBox = this.shape(
      "box",
      red,
      { size: [200, 200, 200] },
      [this.translate(200, 200)],
      true
    );

    const fogColor = this.solidTexture([0, 0, 0]);
    this.constantMedium(0.01, fogColor, box2);
  }

  renderScene(canvas: Canvas) {
    this.generate();
    const sceneData = this.exportJson();
    console.log(sceneData);
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
