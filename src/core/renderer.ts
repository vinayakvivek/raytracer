import { Color, random, sleep, Vec3 } from "../utils";
import { Camera } from "./camera";
import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { Scene } from "./scene";

export class Renderer {
  canvas: Canvas;
  scene: Scene;
  camera: Camera;
  spp = 10;
  width: number;
  height: number;
  tileSize = 50;
  depth = 10;

  constructor(scene: Scene, camera: Camera, spp = 10) {
    this.scene = scene;
    this.camera = camera;
    this.width = camera.width;
    this.height = camera.height;
    this.canvas = new Canvas(this.width, this.height);
    this.spp = spp;
  }

  rayColor(ray: Ray, depth = 5): Color {
    if (depth <= 0) {
      return new Color(0, 0, 0);
    }
    const intersection = this.scene.intersect(ray, 0.001, Infinity);
    if (intersection.valid) {
      const { p, n, material } = intersection;
      const scatter = material.scatter(ray, intersection);
      if (scatter.valid) {
        return this.rayColor(scatter.rayOut, depth - 1).mult(
          scatter.attenuation
        );
      }
      return new Color(0, 0, 0);
    }
    const t = 0.5 * (ray.direction.y + 1.0);
    const color = new Color(1.0, 1.0, 1.0)
      .multScalar(1 - t)
      .addScaled(new Color(0.5, 0.7, 1.0), t);
    return color;
  }

  processPixel(x: number, y: number) {
    const color = new Color();
    for (let i = 0; i < this.spp; ++i) {
      const u = (x + random() * 0.5 - 0.5) / (this.width - 1);
      const v = (y + random() * 0.5 - 0.5) / (this.height - 1);
      const ray = this.camera.generateRay(u, v);
      color.add(this.rayColor(ray, this.depth));
    }
    this.canvas.setPixel(x, y, color.multScalar(1 / this.spp));
  }

  async render() {
    const tileSize = this.tileSize;
    const wt = Math.ceil(this.width / tileSize);
    const ht = Math.ceil(this.height / tileSize);

    const xLimit = (x: number, i: number) =>
      x < (i + 1) * tileSize && x < this.width;

    const yLimit = (y: number, j: number) =>
      y < (j + 1) * tileSize && y < this.height;

    for (let j = ht - 1; j >= 0; --j) {
      for (let i = 0; i < wt; ++i) {
        // process tile
        for (let x = i * tileSize; xLimit(x, i); ++x) {
          for (let y = j * tileSize; yLimit(y, j); ++y) {
            this.processPixel(x, y);
          }
        }
        this.canvas.writeImage();
        await sleep(0);
      }
    }
  }
}
