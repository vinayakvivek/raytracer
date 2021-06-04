import { width, aspectRatio } from "./config";
import { Camera } from "./core/camera";
import { Scene } from "./core/scene";
import { Renderer } from "./core/renderer";
import { Sphere } from "./shape/sphere";
import { LambertianMaterial } from "./materials/lambertian";
import { MetalMaterial } from "./materials/metal";
import "./style.css";
import { Color, Point3 } from "./utils";
import { DielectricMaterial } from "./materials/dielectric";

const camera = new Camera(width, aspectRatio);
const scene = new Scene();

const ground = new Sphere(
  new Point3(0, -100.5, -1),
  100,
  new LambertianMaterial(new Color(0.8, 0.8, 0))
);

const centerSphere = new Sphere(
  new Point3(0, 0, -1),
  0.5,
  new DielectricMaterial(1.5)
);

const leftSphere = new Sphere(
  new Point3(-1, 0, -1),
  0.5,
  new DielectricMaterial(1.5)
);

const rightSphere = new Sphere(
  new Point3(1, 0, -1),
  0.5,
  new MetalMaterial(new Color(0.8, 0.6, 0.2), 1.0)
);

scene.addShape(ground, centerSphere, leftSphere, rightSphere);

const renderer = new Renderer(scene, camera, 100);
renderer.render();
