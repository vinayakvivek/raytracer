import { Canvas } from "../../core/canvas";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { SceneCreator } from "./scene-creator";

export class RayTracingInWeekSceneCreator extends SceneCreator {
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
  }

  renderScene(canvas: Canvas) {
    this.generate();
    const sceneData = this.exportJson();
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
