import { aspectRatio, width } from "./config";
import * as sceneData from "./sample-scenes/cornell_box.json";
import { RayTracingWeekendSceneCreator } from "./sample-scenes/creator/raytracing-weekend";
import { SceneCreator } from "./sample-scenes/creator/scene-creator";
import { CornellBox } from "./sample-scenes/creator/cornell-box";
import { CornellBoxFogSceneCreator } from "./sample-scenes/creator/cornell-box-fog";
import { TestSceneCreator } from "./sample-scenes/creator/test";
import { RayTracingInWeekSceneCreator } from "./sample-scenes/creator/raytracing-week";
import { WorkerCreator } from "./worker-creator";
import sharp from "sharp";

const main = async () => {
  const height = Math.round(width / aspectRatio);
  const sceneData = new TestSceneCreator().exportJson();
  const workerCreator = new WorkerCreator(sceneData, 2, { width, height });
  workerCreator.render();
};

main();

// const sceneCreator = new RayTracingInWeekSceneCreator();
// sceneCreator.renderScene(canvas);
