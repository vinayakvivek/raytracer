import { aspectRatio } from "../config";
import { Camera } from "../core/camera";
import { DielectricMaterial } from "../materials/dielectric";
import { LambertianMaterial } from "../materials/lambertian";
import { MetalMaterial } from "../materials/metal";
import { Sphere } from "../shape/sphere";
import {
  Color,
  Point3,
  random,
  randomBetween,
  randomColor,
  randomColorBetween,
  Vec3,
} from "../utils";
import { SampleScene } from "./sample-scene";

export class RayTracingInAWeekendScene extends SampleScene {
  constructor() {
    super();

    const cameraPosition = new Point3(13, 2, 3);
    const lookAt = new Point3(0, 0, 0);
    const up = new Vec3(0, 1, 0);
    const vfov = 20;
    const aperture = 0.1;
    const focusDist = 10.0;
    this.camera = new Camera(
      cameraPosition,
      lookAt,
      up,
      vfov,
      aspectRatio,
      aperture,
      focusDist
    ); // 90 vfov

    this.initScene();
  }

  initScene() {
    const groundMaterial = new LambertianMaterial(new Color(0.5, 0.5, 0.5));
    const ground = new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial);
    this.scene.addShape(ground);

    for (let a = -11; a < 11; ++a) {
      for (let b = -11; b < 11; ++b) {
        const chooseMaterial = random();
        const center = new Point3(a + 0.9 * random(), 0.2, b + 0.9 * random());

        if (new Point3(4, 0.2, 0).sub(center).length() < 0.9) {
          continue;
        }

        let material;
        if (chooseMaterial < 0.6) {
          const albedo = randomColor().mult(randomColor());
          material = new LambertianMaterial(albedo);
        } else if (chooseMaterial < 0.85) {
          const albedo = randomColorBetween(0.5, 1);
          const fuzz = randomBetween(0, 0.5);
          material = new MetalMaterial(albedo, fuzz);
        } else {
          material = new DielectricMaterial(randomBetween(1.3, 2));
        }
        const sphere = new Sphere(center, 0.2, material);
        this.scene.addShape(sphere);
      }
    }

    const material1 = new DielectricMaterial(1.5);
    const sphere1 = new Sphere(new Point3(0, 1, 0), 1.0, material1);

    const material2 = new LambertianMaterial(new Color(0.4, 0.2, 0.1));
    const sphere2 = new Sphere(new Point3(-4, 1, 0), 1.0, material2);

    const material3 = new MetalMaterial(new Color(0.7, 0.6, 0.5), 0.0);
    const sphere3 = new Sphere(new Point3(4, 1, 0), 1.0, material3);

    this.scene.addShape(sphere1, sphere2, sphere3);
  }
}