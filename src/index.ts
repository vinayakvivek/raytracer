import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { RayTracingInAWeekendScene } from "./sample-scenes/raytracing-in-a-weekend-scene";
import { BasicRenderer } from "./renderer/basic-renderer";
import { BasicScene } from "./sample-scenes/basic-scene";

// set canvas
const canvas = new Canvas(width, Math.round(width / aspectRatio));

const sampleScene = new RayTracingInAWeekendScene();

const renderer = new WorkerRenderer(canvas);
if (renderByPixels) {
  // renderer.renderByPixels();
} else {
  renderer.render();
}
