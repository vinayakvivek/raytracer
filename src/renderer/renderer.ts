import { maxRayDepth, samplesPerPixel } from "../config";
import { Canvas } from "../core/canvas";
import { Ray } from "../core/ray";
import { Scene } from "../core/scene";
import { IScene, Offset, Size } from "../models/scene.model";
import { Color, random } from "../utils";

export class Renderer {
  scene: Scene;
  fullSize: Size;
  size: Size;
  offset: Offset;
  saveDir: string;
  workerId: number;
  maxDepth = maxRayDepth;
  spp = samplesPerPixel;

  invWidth: number;
  invHeight: number;
  logPrefix: string = "";

  constructor(
    sceneData: IScene,
    fullSize: Size,
    size: Size,
    offset: Offset,
    saveDir: string,
    workerId: number
  ) {
    this.scene = new Scene(sceneData);
    this.fullSize = fullSize;
    this.size = size;
    this.offset = offset;
    this.saveDir = saveDir;
    this.workerId = workerId;
    this.logPrefix = `[worker-${workerId}]`;

    this.invWidth = 1 / (fullSize.width - 1);
    this.invHeight = 1 / (fullSize.height - 1);
  }

  _rayColor(ray: Ray, depth = 5): Color {
    if (depth <= 0) {
      return new Color(0, 0, 0);
    }
    const intersection = this.scene.world.intersect(ray, 0.001, Infinity);
    if (intersection.valid) {
      const { p, n, material, uv } = intersection;
      const emitted = material.emitted(uv, p);
      const scatter = material.scatter(ray, intersection);
      if (scatter.valid) {
        return this._rayColor(scatter.rayOut, depth - 1)
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

  _processPixel(x: number, y: number) {
    const u = (x + random()) * this.invWidth;
    const v = (y + random()) * this.invHeight;
    const ray = this.scene.camera.generateRay(u, v);
    return this._rayColor(ray, this.maxDepth);
  }

  async renderUtil() {
    console.log(`${this.logPrefix} creating canvas`, this.size, this.saveDir);
    const canvas = new Canvas(this.size.width, this.size.height, this.saveDir);
    await canvas.init();

    for (let nspp = 0; nspp < this.spp; ++nspp) {
      const logName = `${this.logPrefix} spp - ${nspp + 1} `;
      console.time(logName);
      for (let x = 0; x < this.size.width; ++x) {
        for (let y = 0; y < this.size.height; ++y) {
          const color = this._processPixel(
            x + this.offset.x,
            y + this.offset.y
          );
          canvas.updatePixel(x, y, color, nspp + 1);
        }
      }
      canvas.writeImage(nspp + 1);
      console.timeEnd(logName);
    }
  }

  render() {
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
