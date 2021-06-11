import { Camera } from "../core/camera";
import { DielectricMaterial } from "../materials/dielectric";
import { LambertianMaterial } from "../materials/lambertian";
import { MetalMaterial } from "../materials/metal";
import { MovingSphere } from "../shape/moving-sphere";
import { Sphere } from "../shape/sphere";
import { CheckerTexture } from "../textures/checker";
import { SolidColorTexture } from "../textures/solid-color";
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
    this.camera = new Camera({
      position: [13, 2, 3],
      lookAt: [0, 0, 0],
      up: [0, 1, 0],
      vfov: 25,
      aperture: 0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    });

    this.initScene();
  }

  initScene() {
    const groundMaterial = new LambertianMaterial(
      new CheckerTexture(
        new SolidColorTexture(new Vec3(0, 0, 0)),
        new SolidColorTexture(new Vec3(1, 1, 1))
      )
    );
    const ground = new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial);
    this.world.addShape(ground);

    for (let a = -5; a < 5; ++a) {
      for (let b = -5; b < 5; ++b) {
        const chooseMaterial = random();
        const center = new Point3(a + 0.9 * random(), 0.2, b + 0.9 * random());

        if (new Point3(4, 0.2, 0).sub(center).length() < 0.9) {
          continue;
        }

        let material;
        if (chooseMaterial < 0.6) {
          const color = randomColor().mult(randomColor());
          material = new LambertianMaterial(new SolidColorTexture(color));
          // const center2 = new Vec3(0, randomBetween(0, 0.5), 0).add(center);
          // this.world.addShape(
          //   new MovingSphere(center, center2, 0.2, 0.0, 1.0, material)
          // );
          // continue;
        } else if (chooseMaterial < 0.85) {
          const albedo = randomColorBetween(0.5, 1);
          const fuzz = randomBetween(0, 0.5);
          material = new MetalMaterial(albedo, Math.round(fuzz * 100) / 100);
        } else {
          material = new DielectricMaterial(1.5);
        }
        const sphere = new Sphere(center, 0.2, material);
        this.world.addShape(sphere);
      }
    }

    const material1 = new DielectricMaterial(1.5);
    const sphere1 = new Sphere(new Point3(0, 1, 0), 1.0, material1);

    const material2 = new LambertianMaterial(
      new SolidColorTexture(new Color(0.4, 0.2, 0.1))
    );
    const sphere2 = new Sphere(new Point3(-4, 1, 0), 1.0, material2);

    const material3 = new MetalMaterial(new Color(0.7, 0.6, 0.5), 0.0);
    const sphere3 = new Sphere(new Point3(4, 1, 0), 1.0, material3);

    this.world.addShape(sphere1, sphere2, sphere3);
  }
}
