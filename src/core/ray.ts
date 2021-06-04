import { Point3, Vec3 } from "../utils";

class Ray {

  origin: Point3;
  direction: Vec3;

  constructor(origin: Point3, direction: Vec3) {
    this.origin = origin.clone();
    this.direction = direction.clone().normalize();
  }

  at(t: number): Point3 {
    const p = this.direction.clone();
    return p.multScalar(t).add(this.origin);
  }
}

export { Ray };