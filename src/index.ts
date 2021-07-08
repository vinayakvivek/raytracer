import { aspectRatio, width } from "./config";
import * as data from "./sample-scenes/raytracing-week.json";
import { WorkerCreator } from "./worker-creator";
import { IScene } from "./models/scene.model";
import { CornellBox } from "./sample-scenes/creator/cornell-box";

const main = async () => {
  const height = Math.round(width / aspectRatio);
  const size = { width, height };
  const sceneData = new CornellBox().exportJson();
  const workerCreator = new WorkerCreator(sceneData, 2, size);
  workerCreator.render();
};

main();
