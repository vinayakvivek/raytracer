import { EPSILON } from "./constants";
import { roundTo2 } from "./utils";

export type Array3 = [number, number, number];

class Vec3 {
  x: number;
  y: number;
  z: number;

  get r() {
    return this.x;
  }
  get g() {
    return this.y;
  }
  get b() {
    return this.z;
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toJson(): Array3 {
    return [roundTo2(this.x), roundTo2(this.y), roundTo2(this.z)];
  }

  toArray(): Array3 {
    return [this.x, this.y, this.z];
  }

  static fromJson(v: any) {
    return new Vec3(v[0], v[1], v[2]);
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  copy(v: Vec3) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  add(v: Vec3) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  addScalar(s: number) {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  }

  addScaled(v: Vec3, s: number) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }

  sub(v: Vec3) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  subScalar(s: number) {
    this.x -= s;
    this.y -= s;
    this.z -= s;
    return this;
  }

  subScaled(v: Vec3, s: number) {
    this.x -= v.x * s;
    this.y -= v.y * s;
    this.z -= v.z * s;
    return this;
  }

  mult(v: Vec3) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  multScalar(s: number) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  multScaled(v: Vec3, s: number) {
    this.x *= v.x * s;
    this.y *= v.y * s;
    this.z *= v.z * s;
    return this;
  }

  divScalar(s: number) {
    return this.multScalar(1 / s);
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    return this.divScalar(this.length());
  }

  dot(v: Vec3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3) {
    return this.crossVectors(this, v);
  }

  crossVectors(a: Vec3, b: Vec3) {
    const ax = a.x,
      ay = a.y,
      az = a.z;
    const bx = b.x,
      by = b.y,
      bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  reflect(n: Vec3) {
    return this.subScaled(n, 2 * this.dot(n));
  }

  // rafracionRatio: eta / eta'
  refract(n: Vec3, rafractionRatio: number) {
    const cosTheta = Math.min(-this.dot(n), 1.0);
    const rPerp = this.addScaled(n, cosTheta).multScalar(rafractionRatio);
    const rParallel = n
      .clone()
      .multScalar(-Math.sqrt(Math.abs(1.0 - rPerp.lengthSq())));
    this.copy(rParallel.add(rPerp));
    return this;
  }

  isNearZero() {
    const e = EPSILON;
    return Math.abs(this.x) < e && Math.abs(this.y) < e && Math.abs(this.z) < e;
  }

  static random() {
    const randomNum = () => Math.random() * 2 - 1;
    return new Vec3(randomNum(), randomNum(), randomNum());
  }

  static randomInUnitSphere() {
    const v = Vec3.random().normalize();
    const c = Math.cbrt(Math.random());
    return v.multScalar(c);
  }

  static randomInHemisphere(normal: Vec3) {
    const v = Vec3.randomInUnitSphere();
    if (v.dot(normal) < 0) v.negate();
    return v;
  }

  static randomInUnitDisc() {
    const r = Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    return new Vec3(r * Math.cos(theta), r * Math.sin(theta), 0);
  }

  static randomCosineDirection() {
    const r1 = Math.random();
    const r2 = Math.random();
    const z = Math.sqrt(1 - r2);

    const phi = 2 * Math.PI * r1;
    const sqrt_r2 = Math.sqrt(r2);
    const x = Math.cos(phi) * sqrt_r2;
    const y = Math.sin(phi) * sqrt_r2;
    return new Vec3(x, y, z);
  }

  static max(v1: Vec3, v2: Vec3) {
    return new Vec3(
      Math.max(v1.x, v2.x),
      Math.max(v1.y, v2.y),
      Math.max(v1.z, v2.z)
    );
  }

  static min(v1: Vec3, v2: Vec3) {
    return new Vec3(
      Math.min(v1.x, v2.x),
      Math.min(v1.y, v2.y),
      Math.min(v1.z, v2.z)
    );
  }
}

export { Vec3, Vec3 as Color, Vec3 as Point3 };
