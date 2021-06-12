import "./style.css";
import { aspectRatio, renderByPixels, rendererType, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/earth_scene.json";
import { ImageTexture } from "./textures/image";
import { Scene } from "./core/scene";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
renderer.render();
