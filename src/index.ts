import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import * as sceneData from "./sample-scenes/scene4.json";
import { IScene } from "./models/scene.model";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
if (renderByPixels) {
  // renderer.renderByPixels();
} else {
  renderer.render();
}
