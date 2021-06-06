import { degToRad, Point3, Vec3 } from "../utils";
import { Ray } from "./ray";

export interface CameraProperties {
  position: Point3;
  lookAt: Point3;
  up: Vec3;
  vfov: number;
  aspectRatio: number;
  aperture: number;
  focusDist: number;
}

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

  properties: CameraProperties;

  constructor(properties: CameraProperties) {
    this.properties = { ...properties };
    const theta = degToRad(properties.vfov);
    const h = Math.tan(theta / 2);
    this.viewPortHeight = 2 * h;
    this.viewPortWidth = properties.aspectRatio * this.viewPortHeight;

    const w = new Vec3()
      .add(properties.position)
      .sub(properties.lookAt)
      .normalize();
    const u = properties.up.clone().cross(w).normalize();
    const v = w.clone().cross(u);

    this.origin = properties.position.clone();
    this.horizontal = u
      .clone()
      .multScalar(this.viewPortWidth * properties.focusDist);
    this.vertical = v
      .clone()
      .multScalar(this.viewPortHeight * properties.focusDist);
    this.lowerLeftCorner = this.origin
      .clone()
      .subScaled(this.horizontal, 0.5)
      .subScaled(this.vertical, 0.5)
      .subScaled(w, properties.focusDist);

    this.lensRadius = properties.aperture / 2;
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

  toJson() {
    const data: any = { ...this.properties };
    data.position = data.position.toJson();
    data.lookAt = data.lookAt.toJson();
    data.up = data.up.toJson();
    return data;
  }

  static fromJson(properties: CameraProperties) {
    properties.position = Point3.fromJson(properties.position);
    properties.lookAt = Point3.fromJson(properties.lookAt);
    properties.up = Vec3.fromJson(properties.up);
    return new Camera(properties);
  }
}

export { Camera };
