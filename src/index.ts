import { aspectRatio, width } from "./config";
import * as data from "./sample-scenes/raytracing-week.json";
import { WorkerCreator } from "./worker-creator";
import { IScene } from "./models/scene.model";

const main = async () => {
  const height = Math.round(width / aspectRatio);
  const size = { width, height };
  const sceneData = data as unknown as IScene;
  const workerCreator = new WorkerCreator(sceneData, 3, size);
  workerCreator.render();
};

main();
