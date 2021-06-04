import { degToRad, Point3, Vec3 } from "../utils";
import { Ray } from "./ray";

class Camera {
  viewPortHeight: number;
  viewPortWidth: number;

  origin: Point3;
  horizontal: Vec3;
  vertical: Vec3;
  lowerLeftCorner: Point3;

  lensRadius: number;
  w: Vec3;
  u: Vec3;
  v: Vec3;

  constructor(
    position: Point3,
    lookAt: Point3,
    up: Vec3,
    vfov: number,
    aspectRatio: number,
    aperture: number,
    focusDist: number
  ) {
    const theta = degToRad(vfov);
    const h = Math.tan(theta / 2);
    this.viewPortHeight = 2 * h;
    this.viewPortWidth = aspectRatio * this.viewPortHeight;

    const w = new Vec3().add(position).sub(lookAt).normalize();
    const u = up.clone().cross(w).normalize();
    const v = w.clone().cross(u);

    this.origin = position.clone();
    this.horizontal = u.clone().multScalar(this.viewPortWidth * focusDist);
    this.vertical = v.clone().multScalar(this.viewPortHeight * focusDist);
    this.lowerLeftCorner = this.origin
      .clone()
      .subScaled(this.horizontal, 0.5)
      .subScaled(this.vertical, 0.5)
      .subScaled(w, focusDist);

    this.lensRadius = aperture / 2;
    this.u = u;
    this.v = v;
    this.w = w;
  }

  generateRay(s: number, t: number) {
    const rd = Vec3.randomInUnitDisc().multScalar(this.lensRadius);
    const offset = new Vec3().addScaled(this.u, rd.x).addScaled(this.v, rd.y);

    const direction = this.lowerLeftCorner
      .clone()
      .addScaled(this.horizontal, s)
      .addScaled(this.vertical, t)
      .sub(this.origin)
      .sub(offset);
    return new Ray(this.origin.clone().add(offset), direction);
  }
}

export { Camera };
