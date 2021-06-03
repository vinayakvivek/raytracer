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

  divScalar(s: number) {
    return this.multScalar(1 / s);
  }

  lengthSq() {
    return (this.x * this.x + this.y * this.y + this.z * this.z);
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }
}

export { Vec3, Vec3 as Color, Vec3 as Point3 };
