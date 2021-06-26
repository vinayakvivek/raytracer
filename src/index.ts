import { aspectRatio, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/cornell_box.json";
import { RayTracingWeekendSceneCreator } from "./sample-scenes/creator/raytracing-weekend";
import { SceneCreator } from "./sample-scenes/creator/scene-creator";
import { CornellBox } from "./sample-scenes/creator/cornell-box";
import { CornellBoxFogSceneCreator } from "./sample-scenes/creator/cornell-box-fog";
import { TestSceneCreator } from "./sample-scenes/creator/test";
import { RayTracingInWeekSceneCreator } from "./sample-scenes/creator/raytracing-week";
import sharp from "sharp";
import { Renderer } from "./renderer/renderer";
import { WorkerCreator } from "./worker-creator";

const main = async () => {
  const height = Math.round(width / aspectRatio);
  const sceneData = new TestSceneCreator().exportJson();
  // const renderer = new Renderer(
  //   sceneData,
  //   { width, height },
  //   { width, height },
  //   { x: 0, y: 0 },
  //   "./out/test/p1/"
  // );
  // renderer.render(false); // saveSteps: false
  const workerCreator = new WorkerCreator(sceneData, 2, { width, height });
  workerCreator.render();
};

main();

// const sceneCreator = new RayTracingInWeekSceneCreator();
// sceneCreator.renderScene(canvas);
