import "./style.css";
import { aspectRatio, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/perlin_lighted.json";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
renderer.render();

// const sceneCreator = new RayTracingWeekendSceneCreator();
// sceneCreator.renderScene(canvas);
