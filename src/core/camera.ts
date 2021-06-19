import { aspectRatio } from "../config";
import { ICamera, TimeInterval } from "../models/scene.model";
import { degToRad, Point3, randomBetween, Vec3 } from "../utils";
import { Ray } from "./ray";

class Camera {
  origin: Point3;
  horizontal: Vec3;
  vertical: Vec3;
  lowerLeftCorner: Point3;
  lensRadius: number;
  w: Vec3;
  u: Vec3;
  v: Vec3;

  props: ICamera;
  time: TimeInterval;

  constructor(props: ICamera) {
    this.props = props;
    this.time = props.time;
    const theta = degToRad(props.vfov);
    const h = Math.tan(theta / 2);
    const viewPortHeight = 2 * h;
    const viewPortWidth = aspectRatio * viewPortHeight;

    const w = Point3.fromJson(props.position)
      .sub(Point3.fromJson(props.lookAt))
      .normalize();
    const u = Vec3.fromJson(props.up).cross(w).normalize();
    const v = w.clone().cross(u);

    this.origin = Point3.fromJson(props.position);
    this.horizontal = u.clone().multScalar(viewPortWidth * props.focusDist);
    this.vertical = v.clone().multScalar(viewPortHeight * props.focusDist);
    this.lowerLeftCorner = this.origin
      .clone()
      .subScaled(this.horizontal, 0.5)
      .subScaled(this.vertical, 0.5)
      .subScaled(w, props.focusDist);

    this.lensRadius = props.aperture / 2;
    this.u = u;
    this.v = v;
    this.w = w;
  }

  get _randomTime() {
    return randomBetween(this.time.start, this.time.end);
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
    return new Ray(
      this.origin.clone().add(offset),
      direction,
      this._randomTime
    );
  }

  toJson(): ICamera {
    return this.props;
  }
}

export { Camera };
