import "./style.css";
import { aspectRatio, width } from "./config";
import { Canvas } from "./core/canvas";
import { WorkerRenderer } from "./renderer/worker-renderer";
import { BasicRenderer } from "./renderer/basic-renderer";
import { IScene } from "./models/scene.model";
import * as sceneData from "./sample-scenes/cornell_box.json";
import { RayTracingWeekendSceneCreator } from "./sample-scenes/creator/raytracing-weekend";
import { SceneCreator } from "./sample-scenes/creator/scene-creator";
import { CornellBox } from "./sample-scenes/creator/cornell-box";
import { CornellBoxFogSceneCreator } from "./sample-scenes/creator/cornell-box-fog";
import { TestSceneCreator } from "./sample-scenes/creator/test";
import { RayTracingInWeekSceneCreator } from "./sample-scenes/creator/raytracing-week";

const canvas = new Canvas(width, Math.round(width / aspectRatio));

// const renderer = new BasicRenderer(canvas, sceneData as unknown as IScene);
// renderer.render();

const sceneCreator = new RayTracingInWeekSceneCreator();
sceneCreator.renderScene(canvas);
