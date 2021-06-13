import {
  maxRayDepth,
  renderByPixels,
  samplesPerPixel,
  tileSize,
} from "../config";
import { Color, random, sleep, Vec3 } from "../utils";
import { Canvas } from "../core/canvas";
import { Ray } from "../core/ray";
import { Scene } from "../core/scene";
import { IScene } from "../models/scene.model";

export class BasicRenderer {
  canvas: Canvas;
  scene: Scene;
  width: number;
  height: number;
  spp = samplesPerPixel;
  tileSize = tileSize;
  maxDepth = maxRayDepth;

  constructor(canvas: Canvas, sceneData: IScene) {
    this.scene = new Scene(sceneData);
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    console.log(this.scene.background);
  }

  rayColor(ray: Ray, depth = 5): Color {
    if (depth <= 0) {
      return new Color(0, 0, 0);
    }
    const intersection = this.scene.world.intersect(ray, 0.001, Infinity);
    if (intersection.valid) {
      const { p, n, material, uv } = intersection;
      const emitted = material.emitted(uv, p);
      const scatter = material.scatter(ray, intersection);
      if (scatter.valid) {
        return this.rayColor(scatter.rayOut, depth - 1)
          .clone()
          .mult(scatter.attenuation)
          .add(emitted);
      } else {
        return emitted;
      }
    }
    // no intersection
    return this.scene.background;
  }

  processPixel(x: number, y: number) {
    const u = (x + random() * 0.5 - 0.5) / (this.width - 1);
    const v = (y + random() * 0.5 - 0.5) / (this.height - 1);
    const ray = this.scene.camera.generateRay(u, v);
    return this.rayColor(ray, this.maxDepth);
  }

  async processTiles(callback: (x: number, y: number) => void) {
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
            callback(x, y);
          }
        }
        this.canvas.writeImage();
        await sleep(0);
      }
    }
  }

  async renderByPixels() {
    await this.processTiles((x, y) => {
      const color = new Color();
      for (let i = 0; i < this.spp; ++i) {
        // each time x, y will be offsetted by a small random amount
        color.add(this.processPixel(x, y));
      }
      this.canvas.setPixel(x, y, color.multScalar(1 / this.spp));
    });
  }

  async renderBySamples() {
    for (let nspp = 0; nspp < this.spp; ++nspp) {
      console.time();
      await this.processTiles((x, y) => {
        const color = this.processPixel(x, y);
        const currColor = this.canvas.getPixel(x, y);
        currColor
          .multScalar(nspp)
          .add(color)
          .divScalar(nspp + 1);
        this.canvas.setPixel(x, y, currColor);
      });
      console.log(`spp: ${nspp + 1}`);
      console.timeEnd();
    }
  }

  async renderUtil() {
    if (renderByPixels) {
      this.renderByPixels();
    } else {
      this.renderBySamples();
    }
  }

  async render() {
    // not so happy with this workaround
    // issue: onLoad will not be called if there are no textures to load
    if (this.scene.isLoading) {
      this.scene.setOnLoad(() => {
        this.renderUtil();
      });
    } else {
      this.renderUtil();
    }
  }
}
