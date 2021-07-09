import sharp from "sharp";
import { maxRayDepth, samplesPerPixel } from "../config";
import { Canvas } from "../core/canvas";
import { Ray } from "../core/ray";
import { Scene } from "../core/scene";
import { IScene, Offset, Size } from "../models/scene.model";
import { CosinePDF } from "../pdf/cosine-pdf";
import { MixturePDF } from "../pdf/mixture-pdf";
import { ShapePDF } from "../pdf/shape-pdf";
import { FlipFace } from "../shape/transform-shapes/flip-face";
import { Translate } from "../shape/transform-shapes/translate";
import { Color, Point3, random, randomBetween } from "../utils";

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

    // console.log(
    //   ((this.scene.world.lights[0] as Translate).shape as FlipFace).shape
    // );
    // console.log(this.scene.world.group.shapes);
  }

  _rayColor(ray: Ray, depth = 5): Color {
    if (depth <= 0) {
      return new Color(0, 0, 0);
    }
    const intersection = this.scene.world.intersect(ray, 0.001, Infinity);

    if (!intersection.valid) {
      // no intersection
      return this.scene.background;
    }

    const { p, n, material, uv } = intersection;
    const emitted = material.emitted(uv, p, intersection);
    const scatter = material.scatter(ray, intersection);

    if (!scatter.valid) {
      return emitted;
    }

    // const cp = new CosinePDF(n);
    // const scattered = new Ray(p, cp.generate(), ray.time);
    // const pdfVal = cp.value(scattered.direction);

    const p0 = new ShapePDF(this.scene.world.lights[0], p);
    const p1 = new CosinePDF(n);
    const pdf = new MixturePDF(p0, p1);

    const scattered = new Ray(p, pdf.generate(), ray.time);
    const pdfVal = pdf.value(scattered.direction);

    // const scattered = scatter.rayOut;

    return this._rayColor(scattered, depth - 1)
      .clone()
      .multScalar(material.scatteringPdf(ray, intersection, scattered) / pdfVal)
      .multScaled(scatter.attenuation, 0.9)
      .add(emitted);
  }

  _processPixel(x: number, y: number) {
    const u = (x + random()) * this.invWidth;
    const v = (y + random()) * this.invHeight;
    const ray = this.scene.camera.generateRay(u, v);
    return this._rayColor(ray, this.maxDepth);
  }

  async renderUtil() {
    console.log(`${this.logPrefix} creating canvas`, this.saveDir);
    const canvas = new Canvas(this.size.width, this.size.height, this.saveDir);
    let currSpp = await canvas.init();
    let promise: Promise<sharp.OutputInfo>;
    for (let nspp = 0; nspp < this.spp; ++nspp) {
      currSpp++;
      const logName = `${this.logPrefix} spp - ${currSpp} `;
      console.time(logName);
      for (let x = 0; x < this.size.width; ++x) {
        for (let y = 0; y < this.size.height; ++y) {
          const color = this._processPixel(
            x + this.offset.x,
            y + this.offset.y
          );
          canvas.updatePixel(x, y, color);
        }
      }
      promise = canvas.writeImage(currSpp);
      console.timeEnd(logName);
    }
    promise.then(() => {
      process.send({ done: true });
    });
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
