import { tileSize } from "../config";
import { BasicScene } from "../sample-scenes/basic-scene";
import { RayTracingInAWeekendScene } from "../sample-scenes/raytracing-in-a-weekend-scene";
import { Color, random, sleep } from "../utils";
import { Camera } from "../core/camera";
import { Ray } from "../core/ray";
import { World } from "../core/world";

const renderWorkerCtx: Worker = self as any;

let world: World;
let camera: Camera;
let width: number;
let height: number;
let fullWidth: number;
let fullHeight: number;
let offset: { x: number; y: number };
let maxDepth = 50;
let colors: Color[][] = [];

const rayColor = (ray: Ray, depth: number): Color => {
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }
  const intersection = world.intersect(ray, 0.001, Infinity);
  if (intersection.valid) {
    const { p, n, material } = intersection;
    const scatter = material.scatter(ray, intersection);
    if (scatter.valid) {
      return rayColor(scatter.rayOut, depth - 1).mult(scatter.attenuation);
    }
    return new Color(0, 0, 0);
  }
  const t = 0.5 * (ray.direction.y + 1.0);
  const color = new Color(1.0, 1.0, 1.0)
    .multScalar(1 - t)
    .addScaled(new Color(0.5, 0.7, 1.0), t);
  return color;
};

const processPixel = (x: number, y: number) => {
  const u = (x + random() * 0.5 - 0.5) / (fullWidth - 1);
  const v = (y + random() * 0.5 - 0.5) / (fullHeight - 1);
  const ray = camera.generateRay(u, v);
  return rayColor(ray, maxDepth);
};

const processTiles = async (callback: (x: number, y: number) => void) => {
  const wt = Math.ceil(width / tileSize);
  const ht = Math.ceil(height / tileSize);

  const xLimit = (x: number, i: number) => x < (i + 1) * tileSize && x < width;

  const yLimit = (y: number, j: number) => y < (j + 1) * tileSize && y < height;

  for (let j = ht - 1; j >= 0; --j) {
    for (let i = 0; i < wt; ++i) {
      // process tile
      for (let x = i * tileSize; xLimit(x, i); ++x) {
        for (let y = j * tileSize; yLimit(y, j); ++y) {
          callback(x + offset.x, y + offset.y);
        }
      }
    }
  }
};

const spp = 20;
const render = async () => {
  for (let nspp = 0; nspp < spp; ++nspp) {
    console.time();
    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        const color = processPixel(x + offset.x, y + offset.y);
        colors[x][y]
          .multScalar(nspp)
          .add(color)
          .divScalar(nspp + 1);
      }
    }
    console.log(`spp: ${nspp + 1}`);
    renderWorkerCtx.postMessage({ colors: colors, sendBy: "renderWorker" });
    console.timeEnd();
  }
};

const initColors = () => {
  for (let i = 0; i < width; ++i) {
    const row: Color[] = [];
    for (let j = 0; j < height; ++j) {
      row.push(new Color());
    }
    colors.push(row);
  }
};

renderWorkerCtx.addEventListener("message", (event) => {
  const data = event.data;
  const sampleScene = new BasicScene();
  camera = sampleScene.camera;
  world = sampleScene.world;

  offset = data.offset;
  width = data.dim.width;
  height = data.dim.height;
  fullWidth = data.fullWidth;
  fullHeight = data.fullHeight;

  initColors();
  render().then(() => {
    renderWorkerCtx.postMessage({ done: true });
  });
});
