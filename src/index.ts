import "./style.css";
import { aspectRatio, width } from "./config";
import { Camera } from "./core/camera";
import { Canvas } from "./core/canvas";
import { Renderer } from "./core/renderer";
import { Scene } from "./core/scene";
import { DielectricMaterial } from "./materials/dielectric";
import { LambertianMaterial } from "./materials/lambertian";
import { MetalMaterial } from "./materials/metal";
import { Sphere } from "./shape/sphere";
import { Color, Point3, Vec3 } from "./utils";

// set canvas
const canvas = new Canvas(width, width / aspectRatio);

// set scene
const scene = new Scene();

// set camera
const cameraPosition = new Point3(3, 3, 2);
const lookAt = new Point3(0, 0, -1);
const up = new Vec3(0, 1, 0);
const vfov = 20;
const aperture = 0.1;
const focusDist = lookAt.clone().sub(cameraPosition).length();
const camera = new Camera(
  cameraPosition,
  lookAt,
  up,
  vfov,
  aspectRatio,
  aperture,
  focusDist
); // 90 vfov

// set world objects
// const R = Math.cos(Math.PI / 4);
// const materialLeft = new LambertianMaterial(new Color(0, 0, 1));
// const materialRight = new LambertianMaterial(new Color(1, 0, 0));
// const s1 = new Sphere(new Point3(-R, 0, -1), R, materialLeft);
// const s2 = new Sphere(new Point3(R, 0, -1), R, materialRight);

const groundMaterial = new LambertianMaterial(new Color(0.8, 0.8, 0));
const ground = new Sphere(new Point3(0, -100.5, -1), 100, groundMaterial);

const centerMaterial = new LambertianMaterial(new Color(0.1, 0.2, 0.5));
const s1 = new Sphere(new Point3(0, 0, -1), 0.5, centerMaterial);

const leftMaterial = new DielectricMaterial(1.5);
const s2 = new Sphere(new Point3(-1, 0, -1), 0.5, leftMaterial);
const s3 = new Sphere(new Point3(-1.0, 0.0, -1.0), -0.45, leftMaterial);

const rightMaterial = new MetalMaterial(new Color(0.8, 0.6, 0.2), 0.0);
const s4 = new Sphere(new Point3(1, 0, -1), 0.5, rightMaterial);

scene.addShape(ground, s1, s2, s3, s4);

const renderer = new Renderer(canvas, scene, camera);
renderer.render();
