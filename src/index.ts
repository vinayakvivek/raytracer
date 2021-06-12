import "./style.css";
import {
  aspectRatio,
  loadingManager,
  renderByPixels,
  rendererType,
  width,
} from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/earth_scene.json";
import { ImageTexture } from "./textures/image";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

const render = () => {
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

// render();
// const imageTexture = new ImageTexture("/textures/earth.jpg");
const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);

loadingManager.onProgress = (item, loaded, total) => {
  console.log({
    item,
    loaded,
    total,
  });
};

loadingManager.onLoad = (total) => {
  console.log(`Loading complete. Loaded ${total} items`);
  // const v = imageTexture.value({ u: 0.5, v: 0.5 }, null);
  // console.log(v);
  renderer.render();
};
