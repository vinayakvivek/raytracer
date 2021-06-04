import { width, aspectRatio } from "./config";
import { Camera } from "./core/camera";
import { Scene } from "./core/scene";
import { Renderer } from "./core/renderer";
import { Sphere } from "./shape/sphere";
import { LambertianMaterial } from "./materials/lambertian";
import "./style.css";
import { Color, Point3 } from "./utils";

const camera = new Camera(width, aspectRatio);
const scene = new Scene();

const material = new LambertianMaterial(new Color(0.8, 1.0, 0.8));
const material2 = new LambertianMaterial(new Color(1.0, 0.5, 0));
const sphere = new Sphere(new Point3(0, 0, -1), 0.5, material);
const ground = new Sphere(new Point3(0, -100.5, -1), 100, material2);
scene.addShape(ground, sphere);

const renderer = new Renderer(scene, camera, 100);
renderer.render();
