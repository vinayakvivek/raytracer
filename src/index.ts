import "./style.css";
import { aspectRatio, renderByPixels, rendererType, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/two_perlin_spheres.json";
import { perlinNoise } from "./utils/perlin";
import { Point3 } from "./utils";

const render = () => {
  const canvas = new Canvas(width, Math.round(width / aspectRatio));

  if (rendererType === "worker") {
    const renderer = new WorkerRenderer(canvas, sceneData as unknown as IScene);
    renderer.render();
  } else if (rendererType === "basic") {
    const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
    if (renderByPixels) {
      renderer.renderByPixels();
    } else {
      renderer.render();
    }
  }
};

// console.log(perlinNoise(new Point3(1.23, 4.654, 12.323)));
render();

for (let x = -10; x < 10; x += 0.02) {
  console.log(perlinNoise(new Point3(x, 0, 5)));
}
