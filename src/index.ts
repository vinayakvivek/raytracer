import "./style.css";
import { aspectRatio, renderByPixels, rendererType, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
// import * as sceneData from "./sample-scenes/scene5.json";
import { IScene } from "./models/scene.model";
import { RayTracingInAWeekendScene } from "./sample-scenes/raytracing-in-a-weekend-scene";
import { Scene } from "./core/scene";
import { downloadData } from "./utils";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

const sample = new RayTracingInAWeekendScene();
const scene = new Scene();
scene.world = sample.world;
scene.camera = sample.camera;

const sceneData = scene.toJson();
const renderer = new BasicRenderer(canvas, sceneData);
renderer.render();

// downloadData(scene.toJson());
// const scene = new Scene();
// scene.parse(sceneData as unknown as IScene);
// console.log(scene);

// if (rendererType === "worker") {
//   const renderer = new WorkerRenderer(canvas, sceneData as unknown as IScene);
//   renderer.render();
// } else if (rendererType === "basic") {
//   const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
//   if (renderByPixels) {
//     renderer.renderByPixels();
//   } else {
//     renderer.render();
//   }
// }
