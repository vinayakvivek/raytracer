import { width, aspectRatio } from "./config";
import { Camera } from "./core/camera";
import { Ray } from "./core/ray";
import { Scene } from "./core/scene";
import { Canvas } from "./core/canvas";
import { Sphere } from "./shape/sphere";
import "./style.css";
import { Color, Point3, sleep, Vec3 } from './utils';

const height = width / aspectRatio;
const canvas = new Canvas(width, height);

const camera = new Camera(width, aspectRatio);

const scene = new Scene();
const sphere = new Sphere(new Point3(0, 0, -1), 0.5);
const ground = new Sphere(new Point3(0, -100.5, -1), 100);
scene.addShape(sphere);
scene.addShape(ground);

const rayColor = (ray: Ray) => {
  const intersection = scene.intersect(ray, 0.01, 10000);
  if (intersection.valid) {
    return intersection.n.addScaled(new Vec3(1, 1, 1), 0.5);
  }
  const t = 0.5 * (ray.direction.y + 1.0);
  const color = new Color(1.0, 1.0, 1.0)
    .multScalar(1 - t)
    .addScaled(new Color(0.5, 0.7, 1.0), t);
  return color;
}

const tileSize = 10;

const sampleScene = async () => {
  const wt = Math.ceil(width / tileSize);
  const ht = Math.ceil(height / tileSize);
  for (let j = ht - 1; j >= 0; --j) {
    for (let i = 0; i < wt; ++i) {

      // process tile
      for (let x = i * tileSize; x < (i + 1) * tileSize && x < width; ++x) {
        for (let y = j * tileSize; y < (j + 1) * tileSize && y < height; ++y) {
          const ray = camera.generateRay(x / (width - 1), y / (height - 1));
          canvas.setPixel(x, height - y - 1, rayColor(ray));
        }
      }
      canvas.writeImage();
    }
  }

  // for (let x = 0; x < width; ++x) {
  //   for (let y = 0; y < height; ++y) {
  //     const ray = camera.generateRay(x / (width - 1), y / (height - 1));
  //     canvas.setPixel(x, height - y - 1, rayColor(ray));
  //   }
  //   canvas.writeImage();
  // }
}

sampleScene();

