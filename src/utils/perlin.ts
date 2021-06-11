import { clamp, randomBetween } from "./utils";
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

const trilinearInterp = (c: number[][][], u: number, v: number, w: number) => {
  let accum = 0.0;
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
      for (let k = 0; k < 2; k++)
        accum +=
          (i * u + (1 - i) * (1 - u)) *
          (j * v + (1 - j) * (1 - v)) *
          (k * w + (1 - k) * (1 - w)) *
          c[i][j][k];
  return accum;
};

export const perlinNoise = (p: Point3) => {
  let u = p.x - Math.floor(p.x);
  let v = p.y - Math.floor(p.y);
  let w = p.z - Math.floor(p.z);
  u = u * u * (3 - 2 * u);
  v = v * v * (3 - 2 * v);
  w = w * w * (3 - 2 * w);

  const i = Math.floor(p.x);
  const j = Math.floor(p.y);
  const k = Math.floor(p.z);

  const c: number[][][] = [
    [
      [0, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
    ],
  ];

  for (let di = 0; di < 2; di++)
    for (let dj = 0; dj < 2; dj++)
      for (let dk = 0; dk < 2; dk++)
        c[di][dj][dk] =
          rands[px[(i + di) & 255] ^ py[(j + dj) & 255] ^ pz[(k + dk) & 255]];

  // console.log(c);
  return trilinearInterp(c, u, v, w);
};
