import { width, aspectRatio } from "./config";
import { Camera } from "./core/camera";
import { Ray } from "./core/ray";
import "./style.css";
import { Canvas, Color, Point3, sleep } from './utils';

const height = width / aspectRatio;
const canvas = new Canvas(width, height);

const camera = new Camera(width, aspectRatio);

const hitSphere = (center: Point3, radius: number, r: Ray) => {
  const oc = r.origin.clone().sub(center);
  const a = r.direction.dot(r.direction);
  const b = 2 * oc.dot(r.direction);
  const c = oc.dot(oc) - radius * radius;
  const discriminant = b * b - 4 * a * c;
  return discriminant > 0;
}

const rayColor = (ray: Ray) => {
  if (hitSphere(new Point3(0, 0, -1), 0.5, ray)) {
    return new Color(1, 0, 0);
  }
  const t = 0.5 * (ray.direction.y + 1.0);
  const color = new Color(1.0, 1.0, 1.0)
    .multScalar(1 - t)
    .addScaled(new Color(0.5, 0.7, 1.0), t);
  return color;
}

const sampleScene = async () => {
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const ray = camera.generateRay(x / (width - 1), y / (height - 1));
      canvas.setPixel(x, height - y - 1, rayColor(ray));
    }
    canvas.writeImage();
  }
}

sampleScene();

