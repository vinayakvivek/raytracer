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
import { Color, Point3 } from "./utils";

const canvas = new Canvas(width, width / aspectRatio);
const camera = new Camera(90, aspectRatio); // 90 vfov
const scene = new Scene();

const R = Math.cos(Math.PI / 4);
const materialLeft = new LambertianMaterial(new Color(0, 0, 1));
const materialRight = new LambertianMaterial(new Color(1, 0, 0));
const s1 = new Sphere(new Point3(-R, 0, -1), R, materialLeft);
const s2 = new Sphere(new Point3(R, 0, -1), R, materialRight);

const groundMaterial = new LambertianMaterial(new Color(0.8, 0.8, 0));
const ground = new Sphere(new Point3(0, -100.5, -1), 100, groundMaterial);

const centerMaterial = new LambertianMaterial(new Color(0.1, 0.2, 0.5));
const centerSphere = new Sphere(new Point3(0, 0, -1), 0.5, centerMaterial);

const leftMaterial = new DielectricMaterial(1.5);
const leftSphere = new Sphere(new Point3(-1, 0, -1), 0.5, leftMaterial);
const leftSphere2 = new Sphere(new Point3(-1.0, 0.0, -1.0), -0.4, leftMaterial);

const rightMaterial = new MetalMaterial(new Color(0.8, 0.6, 0.2), 0.0);
const rightSphere = new Sphere(new Point3(1, 0, -1), 0.5, rightMaterial);

scene.addShape(s1, s2);

const renderer = new Renderer(canvas, scene, camera);
renderer.render();
