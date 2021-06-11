import { randomBetween } from "./utils";
import { Point3 } from "./vec3";

const count: number = 256;
const rands = new Float32Array(count);
const px = new Uint8Array(count);
const py = new Uint8Array(count);
const pz = new Uint8Array(count);

const generatePerlinPerm = (p: Uint8Array) => {
  for (let i = 0; i < count; i++) {
    p[i] = i;
  }
  permute(p, count);
};

const permute = (p: Uint8Array, n: number) => {
  for (let i = n - 1; i > 0; i--) {
    const target = randomBetween(0, i) ^ 0;
    [p[i], p[target]] = [p[target], p[i]]; // swap
  }
};

generatePerlinPerm(px);
generatePerlinPerm(py);
generatePerlinPerm(pz);
for (let i = 0; i < count; ++i) {
  rands[i] = Math.random();
}

export const perlinNoise = (p: Point3) => {
  const i = ((4 * p.x) ^ 0) & 255;
  const j = ((4 * p.y) ^ 0) & 255;
  const k = ((4 * p.z) ^ 0) & 255;
  return rands[px[i] ^ py[j] ^ pz[k]];
};
