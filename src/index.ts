import { width, aspectRatio } from "./config";
import { Camera } from "./core/camera";
import { Ray } from "./core/ray";
import { Scene } from "./core/scene";
import { Renderer } from "./core/renderer";
import { Sphere } from "./shape/sphere";
import "./style.css";
import { Color, Point3, random, sleep, Vec3 } from "./utils";

const camera = new Camera(width, aspectRatio);
const scene = new Scene();
const sphere = new Sphere(new Point3(0, 0, -1), 0.5);
const ground = new Sphere(new Point3(0, -100.5, -1), 100);
scene.addShape(ground, sphere);

const renderer = new Renderer(scene, camera, 100);
renderer.render();
