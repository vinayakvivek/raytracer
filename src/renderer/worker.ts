import { maxRayDepth, samplesPerPixel, tileSize } from "../config";
import { Color, random } from "../utils";
import { Camera } from "../core/camera";
import { Ray } from "../core/ray";
import { World } from "../core/world";
import { Scene } from "../core/scene";

let scene: Scene;
let world: World;
let camera: Camera;
let width: number;
let height: number;
let fullWidth: number;
let fullHeight: number;
let offset: { x: number; y: number };
const maxDepth = maxRayDepth;
const spp = samplesPerPixel;
let colors: Color[][] = [];

const rayColor = (ray: Ray, depth = 5): Color => {
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }
  const intersection = scene.world.intersect(ray, 0.001, Infinity);
  if (intersection.valid) {
    const { p, n, material, uv } = intersection;
    const emitted = material.emitted(uv, p);
    const scatter = material.scatter(ray, intersection);
    if (scatter.valid) {
      return rayColor(scatter.rayOut, depth - 1)
        .clone()
        .mult(scatter.attenuation)
        .add(emitted);
    } else {
      return emitted;
    }
  }
  // no intersection
  return scene.background;
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

const render = () => {
  process.send({ message: "rendering" });
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
    process.send({ message: "rendered 1 sample" });

    console.log(`spp: ${nspp + 1}`);
    process.send({ colors, sendBy: "renderWorker" });
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

const renderUtil = () => {
  render();
  process.send({ done: true });
};

process.on("message", (data) => {
  scene = new Scene(data.sceneData);
  camera = scene.camera;
  world = scene.world;

  offset = data.offset;
  width = data.dim.width;
  height = data.dim.height;
  fullWidth = data.fullWidth;
  fullHeight = data.fullHeight;

  initColors();

  if (scene.isLoading) {
    scene.setOnLoad(() => {
      renderUtil();
    });
  } else {
    renderUtil();
  }
});
