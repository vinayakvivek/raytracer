import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { RayTracingInAWeekendScene } from "./sample-scenes/raytracing-in-a-weekend-scene";
import { BasicRenderer } from "./renderer/basic-renderer";
import { BasicScene } from "./sample-scenes/basic-scene";
import { Scene } from "./core/scene";

// set canvas
const canvas = new Canvas(width, Math.round(width / aspectRatio));

const sampleScene = new BasicScene();
const scene = new Scene();
scene.camera = sampleScene.camera;
scene.world = sampleScene.world;

const sceneData = JSON.stringify(scene.toJson());
// console.log(scene.toJson());
scene.parse(JSON.parse(sceneData));
// console.log(scene);

const renderer = new BasicRenderer(canvas, scene);
if (renderByPixels) {
  renderer.renderByPixels();
} else {
  renderer.render();
}
