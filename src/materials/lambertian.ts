import { Ray } from "../core/ray";
import { Color, Point3, Vec3 } from "../utils";
import { Material, Scatter } from "./material";

export class LambertianMaterial extends Material {
  albedo: Color;

  constructor(albedo: Color) {
    super();
    this.albedo = albedo;
  }

  scatter(rayIn: Ray, p: Point3, n: Vec3): Scatter {
    // const targetDir = n.add(Vec3.randomInUnitSphere());  // simple diffuse
    // const targetDir = n.add(Vec3.random().normalize()); // true lambertian
    // const targetDir = Vec3.randomInHemisphere(n); // diffuse (hemispherical)
    let scatterDir = n.add(Vec3.random().normalize());

    // check if direction is exactly opposite to normal
    if (scatterDir.isNearZero()) {
      scatterDir = n;
    }

    const scatteredRay = new Ray(p, scatterDir);
    return {
      valid: true,
      attenuation: this.albedo.clone(),
      rayOut: scatteredRay,
    };
  }
}
