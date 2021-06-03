import { Point3, Vec3 } from "../utils";
import { Ray } from "./ray";

class Camera {

  aspectRatio: number;
  width: number;
  height: number;

  viewPortHeight = 2.0;
  viewPortWidth = 2.0;
  focalLength = 1.0;

  origin: Point3;
  horizontal: Vec3;
  vertical: Vec3;
  lowerLeftCorner: Point3;

  constructor(width: number, aspectRatio: number) {
    this.aspectRatio = aspectRatio;
    this.width = width;
    this.height = this.width / aspectRatio;

    this.viewPortWidth = aspectRatio * this.viewPortHeight;

    this.origin = new Point3();
    this.horizontal = new Vec3(this.viewPortWidth, 0, 0);
    this.vertical = new Vec3(0, this.viewPortHeight, 0);
    this.lowerLeftCorner = this.origin.clone()
      .subScaled(this.horizontal, 0.5)
      .subScaled(this.vertical, 0.5)
      .sub(new Vec3(0, 0, this.focalLength));
  }

  generateRay(u: number, v: number) {
    const direction = this.lowerLeftCorner.clone()
      .addScaled(this.horizontal, u)
      .addScaled(this.vertical, v)
      .sub(this.origin);
    return new Ray(this.origin, direction);
  }
}

export { Camera }
