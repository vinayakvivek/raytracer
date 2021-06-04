import { degToRad, Point3, Vec3 } from "../utils";
import { Ray } from "./ray";

class Camera {
  viewPortHeight: number;
  viewPortWidth: number;

  origin: Point3;
  horizontal: Vec3;
  vertical: Vec3;
  lowerLeftCorner: Point3;

  constructor(
    position: Point3,
    lookAt: Point3,
    up: Vec3,
    vfov: number,
    aspectRatio: number
  ) {
    const theta = degToRad(vfov);
    const h = Math.tan(theta / 2);
    this.viewPortHeight = 2 * h;
    this.viewPortWidth = aspectRatio * this.viewPortHeight;

    const w = new Vec3().add(position).sub(lookAt).normalize();
    const u = up.clone().cross(w).normalize();
    const v = w.clone().cross(u);

    this.origin = position.clone();
    this.horizontal = u.clone().multScalar(this.viewPortWidth);
    this.vertical = v.clone().multScalar(this.viewPortHeight);
    this.lowerLeftCorner = this.origin
      .clone()
      .subScaled(this.horizontal, 0.5)
      .subScaled(this.vertical, 0.5)
      .sub(w);
  }

  generateRay(s: number, t: number) {
    const direction = this.lowerLeftCorner
      .clone()
      .addScaled(this.horizontal, s)
      .addScaled(this.vertical, t)
      .sub(this.origin);
    return new Ray(this.origin, direction);
  }
}

export { Camera };
