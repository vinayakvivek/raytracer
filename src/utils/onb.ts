import { Vec3 } from "./vec3";

export class ONB {
  u: Vec3;
  v: Vec3;
  w: Vec3;

  constructor(n: Vec3) {
    this.w = n.clone().normalize();
    const a = Math.abs(this.w.x) > 0.9 ? new Vec3(0, 1, 0) : new Vec3(1, 0, 0);
    this.v = this.w.clone().cross(a).normalize();
    this.u = this.w.clone().cross(this.v).normalize();
  }

  local(a: Vec3): Vec3 {
    return new Vec3()
      .addScaled(this.u, a.x)
      .addScaled(this.v, a.y)
      .addScaled(this.w, a.z);
  }
}
