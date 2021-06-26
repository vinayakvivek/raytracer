import {
  ILambertianMaterial,
  IMaterial,
  MaterialType,
} from "../../models/material.model";
import { ISphere } from "../../models/shape.model";
import {
  ICheckerTexture,
  ISolidColorTexture,
} from "../../models/texture.model";
import {
  Array3,
  Point3,
  random,
  randomBetween,
  randomColor,
  randomColorBetween,
} from "../../utils";
import { SceneCreator } from "./scene-creator";

export class RayTracingWeekendSceneCreator extends SceneCreator {
  constructor() {
    super();
    this.name = "raytracing-weekend";
  }

  _createGround() {
    const black: ISolidColorTexture = {
      id: this.textureId,
      name: "black",
      type: "solid",
      color: [0, 0, 0],
    };
    this.textures.push(black);
    const white: ISolidColorTexture = {
      id: this.textureId,
      name: "white",
      type: "solid",
      color: [1, 1, 1],
    };
    this.textures.push(white);
    const checker: ICheckerTexture = {
      id: this.textureId,
      name: "checker",
      type: "checker",
      oddId: black.id,
      evenId: white.id,
    };
    this.textures.push(checker);

    const mat: ILambertianMaterial = {
      id: this.materialId,
      name: "ground",
      type: "lambertian",
      textureId: checker.id,
    };
    this.materials.push(mat);
    this.shapes.push(<ISphere>{
      id: this.shapeId,
      name: "ground",
      type: "sphere",
      materialId: mat.id,
      center: [0, -1000, 0],
      radius: 1000,
    });
  }

  _createSphere(
    materialType: MaterialType,
    center: Array3,
    color?: Array3,
    radius = 0.2,
    noFuzz = false
  ) {
    let tex: ISolidColorTexture;
    if (color) {
      tex = {
        id: this.textureId,
        name: "t",
        type: "solid",
        color,
      };
      this.textures.push(tex);
    }
    const mat: IMaterial & any = {
      id: this.materialId,
      name: "m",
      type: materialType,
    };
    switch (materialType) {
      case "lambertian":
        mat.textureId = tex.id;
        break;
      case "metal":
        mat.textureId = tex.id;
        mat.fuzz = noFuzz ? 0 : randomBetween(0, 0.4);
        break;
      case "dielectric":
        mat.refractiveIndex = 1.5;
        break;
    }
    this.materials.push(mat);

    this.shapes.push(<ISphere>{
      id: this.shapeId,
      name: "s",
      type: "sphere",
      materialId: mat.id,
      center,
      radius: radius,
    });
  }

  generate() {
    this.camera = {
      position: [13, 2, 3],
      lookAt: [0, 0, 0],
      up: [0, 1, 0],
      vfov: 25,
      aperture: 0.1,
      focusDist: 10.0,
      time: { start: 0, end: 1 },
    };
    this._createGround();

    const bigP = new Point3(4, 0.2, 0);

    const limit = 10;
    for (let a = -limit; a < limit; ++a) {
      for (let b = -limit; b < limit; ++b) {
        const chooseMat = random();
        const center: Array3 = [a + 0.9 * random(), 0.2, b + 0.9 * random()];

        if (Point3.fromJson(center).sub(bigP).length() < 0.9) {
          continue;
        }

        if (chooseMat < 0.6) {
          const color = randomColor().mult(randomColor());
          this._createSphere("lambertian", center, color.toJson());
        } else if (chooseMat < 0.85) {
          const color = randomColorBetween(0.5, 1);
          this._createSphere("metal", center, color.toJson());
        } else {
          this._createSphere("dielectric", center);
        }
      }
    }

    this._createSphere("dielectric", [0, 1, 0], null, 1);
    this._createSphere("lambertian", [-4, 1, 0], [0.4, 0.2, 0.1], 1);
    this._createSphere("metal", [4, 1, 0], [0.7, 0.6, 0.5], 1, true);
  }
}
