import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { RayTracingInAWeekendScene } from "./sample-scenes/raytracing-in-a-weekend-scene";
import { BasicRenderer } from "./renderer/basic-renderer";
import { BasicScene } from "./sample-scenes/basic-scene";
import { Scene } from "./core/scene";
import * as sceneData from "./sample-scenes/scene2.json";

// set canvas
const canvas = new Canvas(width, Math.round(width / aspectRatio));

// const sampleScene = new RayTracingInAWeekendScene();
// const scene = new Scene();
// scene.camera = sampleScene.camera;
// scene.world = sampleScene.world;

// console.log(JSON.stringify(scene.toJson()));

const scene = new Scene();
scene.parse(sceneData);
// console.log(scene);

const renderer = new BasicRenderer(canvas, scene);
if (renderByPixels) {
  renderer.renderByPixels();
} else {
  renderer.render();
}
