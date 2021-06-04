import "./style.css";
import { aspectRatio, renderByPixels, width } from "./config";
import { Camera } from "./core/camera";
import { Canvas } from "./core/canvas";
import { Renderer } from "./core/renderer";
import { Scene } from "./core/scene";
import { DielectricMaterial } from "./materials/dielectric";
import { LambertianMaterial } from "./materials/lambertian";
import { MetalMaterial } from "./materials/metal";
import { Sphere } from "./shape/sphere";
import { Color, Point3, random, randomBetween, Vec3 } from "./utils";

// set canvas
const canvas = new Canvas(width, Math.round(width / aspectRatio));

// set scene
const scene = new Scene();

// set camera
const cameraPosition = new Point3(15, 5, 3);
const lookAt = new Point3(0, 0, 0);
const up = new Vec3(0, 1, 0);
const vfov = 20;
const aperture = 0.1;
const focusDist = 10.0;
const camera = new Camera(
  cameraPosition,
  lookAt,
  up,
  vfov,
  aspectRatio,
  aperture,
  focusDist
); // 90 vfov

const groundMaterial = new LambertianMaterial(new Color(0.5, 0.5, 0.5));
const ground = new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial);
scene.addShape(ground);

const randomColor = () => new Color(random(), random(), random());
const randomColorBetween = (min: number, max: number) =>
  new Color(
    randomBetween(min, max),
    randomBetween(min, max),
    randomBetween(min, max)
  );

for (let a = -8; a < 8; ++a) {
  for (let b = -8; b < 8; ++b) {
    const chooseMaterial = random();
    const center = new Point3(
      a + 0.9 * random(),
      randomBetween(0.2, 0.8),
      b + 0.9 * random()
    );

    if (new Point3(4, 0.2, 0).sub(center).length() < 0.9) {
      continue;
    }

    let material;
    if (chooseMaterial < 0.8) {
      const albedo = randomColor().mult(randomColor());
      material = new LambertianMaterial(albedo);
    } else if (chooseMaterial < 0.95) {
      const albedo = randomColorBetween(0.5, 1);
      const fuzz = randomBetween(0, 0.5);
      material = new MetalMaterial(albedo, fuzz);
    } else {
      material = new DielectricMaterial(randomBetween(1.3, 2));
    }
    const r = randomBetween(0.15, 0.4);
    const sphere = new Sphere(center, r, material);
    scene.addShape(sphere);
  }
}

const material1 = new DielectricMaterial(1.5);
const sphere1 = new Sphere(new Point3(0, 1, 0), 1.0, material1);

const material2 = new LambertianMaterial(new Color(0.4, 0.2, 0.1));
const sphere2 = new Sphere(new Point3(-4, 1, 0), 1.0, material2);

const material3 = new MetalMaterial(new Color(0.7, 0.6, 0.5), 0.0);
const sphere3 = new Sphere(new Point3(4, 1, 0), 1.0, material3);

scene.addShape(sphere1, sphere2, sphere3);

const renderer = new Renderer(canvas, scene, camera);
if (renderByPixels) {
  renderer.renderByPixels();
} else {
  renderer.render();
}
