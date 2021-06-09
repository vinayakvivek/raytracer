import { Camera } from "../core/camera";
import { DielectricMaterial } from "../materials/dielectric";
import { LambertianMaterial } from "../materials/lambertian";
import { MetalMaterial } from "../materials/metal";
import { Sphere } from "../shape/sphere";
import { Color, Point3, Vec3 } from "../utils";
import { SampleScene } from "./sample-scene";

export class BasicScene extends SampleScene {
  constructor() {
    super();
    this.camera = new Camera({
      position: [-2, 2, 1],
      lookAt: [0, 0, -1],
      up: [0, 1, 0],
      vfov: 75,
      aperture: 0.0,
      focusDist: 1.0,
      startTime: 0.0,
      endTime: 1.0,
    });
    this.initScene();
  }

  initScene() {
    const groundMaterial = new LambertianMaterial(new Color(0.8, 0.8, 0.0));
    const ground = new Sphere(new Point3(0, -100.5, -1), 100, groundMaterial);
    this.world.addShape(ground);

    const centerMaterial = new LambertianMaterial(new Color(0.1, 0.2, 0.5));
    const s1 = new Sphere(new Point3(0, 0, -1), 0.5, centerMaterial);

    const leftMaterial = new DielectricMaterial(1.5);
    const s2 = new Sphere(new Point3(-1, 0, -1), 0.5, leftMaterial);
    const s3 = new Sphere(new Point3(-1.0, 0.0, -1.0), -0.45, leftMaterial);

    const rightMaterial = new MetalMaterial(new Color(0.8, 0.6, 0.2), 0.0);
    const s4 = new Sphere(new Point3(1, 0, -1), 0.5, rightMaterial);

    this.world.addShape(s1, s2, s3, s4);
  }
}
