import { Canvas } from "../../core/canvas";
import { IAbstractShape } from "../../models/shape.model";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { random, randomBetween } from "../../utils";
import { SceneCreator } from "./scene-creator";

export class RayTracingInWeekSceneCreator extends SceneCreator {
  _createGroundBoxes() {
    const material = this.diffuseMaterial([0.48, 0.83, 0.53]);
    const n = 20;
    const w = 100;

    const items: IAbstractShape[] = [];
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        const h = randomBetween(1, 101);
        const tx = -1000 + i * w;
        const tz = -1000 + j * w;
        const box = this.groupItem("box", material, { size: [w, h, w] }, [
          this.translate(tx, 0, tz),
        ]);
        items.push(box);
      }
    }
    this.group(items);
  }

  generate() {
    this.camera = {
      position: [478, 278, -600],
      lookAt: [278, 278, 0],
      up: [0, 1, 0],
      vfov: 40,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };
    this.background = [0, 0, 0];

    // main light
    const lightMat = this.light([7, 7, 7]);
    this.shape("rectangle", lightMat, { width: 300, height: 265, plane: 2 }, [
      this.translate(123, 554, 147),
    ]);
    this._createGroundBoxes();
  }

  renderScene(canvas: Canvas) {
    this.generate();
    const sceneData = this.exportJson();
    console.log(sceneData);
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
