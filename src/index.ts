import { aspectRatio, width } from "./config";
import * as sceneData from "./sample-scenes/two_perlin_spheres.json";
import { RayTracingWeekendSceneCreator } from "./sample-scenes/creator/raytracing-weekend";
import { SceneCreator } from "./sample-scenes/creator/scene-creator";
import { CornellBox } from "./sample-scenes/creator/cornell-box";
import { CornellBoxFogSceneCreator } from "./sample-scenes/creator/cornell-box-fog";
import { TestSceneCreator } from "./sample-scenes/creator/test";
import { RayTracingInWeekSceneCreator } from "./sample-scenes/creator/raytracing-week";
import { WorkerCreator } from "./worker-creator";
import sharp from "sharp";
import { IScene } from "./models/scene.model";

const main = async () => {
  const height = Math.round(width / aspectRatio);
  // const sceneData = new RayTracingInWeekSceneCreator().exportJson();
  const workerCreator = new WorkerCreator(sceneData as unknown as IScene, 4, {
    width,
    height,
  });
  workerCreator.render();
};

main();

// const sceneCreator = new RayTracingInWeekSceneCreator();
// sceneCreator.renderScene(canvas);
