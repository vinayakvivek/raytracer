import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Canvas } from "./core/canvas";
import { Renderer } from "./core/renderer";
import { RayTracingInAWeekendScene } from "./sample-scenes/raytracing-in-a-weekend-scene";

// set canvas
const canvas = new Canvas(width, Math.round(width / aspectRatio));

const sampleScene = new RayTracingInAWeekendScene();

const renderer = new Renderer(canvas, sampleScene.scene, sampleScene.camera);
if (renderByPixels) {
  renderer.renderByPixels();
} else {
  renderer.render();
}
