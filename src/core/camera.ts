import { aspectRatio } from "../config";
import { ICamera } from "../models/scene.model";
import { degToRad, Point3, Vec3 } from "../utils";
import { Ray } from "./ray";

export interface CameraProperties {
  position: Point3;
  lookAt: Point3;
  up: Vec3;
  vfov: number;
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
    this.viewPortWidth = aspectRatio * this.viewPortHeight;

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

  toJson(): ICamera {
    const data: CameraProperties = { ...this.properties };
    return {
      ...data,
      position: data.position.toJson(),
      lookAt: data.lookAt.toJson(),
      up: data.up.toJson(),
    };
  }

  static fromJson(props: ICamera) {
    return new Camera({
      ...props,
      position: Point3.fromJson(props.position),
      lookAt: Point3.fromJson(props.lookAt),
      up: Vec3.fromJson(props.up),
    });
  }
}

export { Camera };
