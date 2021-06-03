class Vec3 {
  x: number;
  y: number;
  z: number;

  get r() { return this.x; }
  get g() { return this.y; }
  get b() { return this.z; }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vec3(this.x, this.y, this.z);
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
    return (this.x * this.x + this.y * this.y + this.z * this.z);
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  normalize() {
    return this.divScalar(this.length());
  }

  dot(v: Vec3) {
    return (this.x * v.x + this.y * v.y + this.z * v.z);
  }

  cross(v: Vec3) {
    return this.crossVectors(this, v);
  }

  crossVectors(a: Vec3, b: Vec3) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
}

export { Vec3, Vec3 as Color, Vec3 as Point3 };
