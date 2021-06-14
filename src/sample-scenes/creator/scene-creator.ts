import { Canvas } from "../../core/canvas";
import {
  IDielectricMaterial,
  ILambertianMaterial,
  IMaterial,
  IMetalMaterial,
} from "../../models/material.model";
import { ICamera, IScene } from "../../models/scene.model";
import { IAbstractShape, ISphere } from "../../models/shape.model";
import {
  IImageTexture,
  ISolidColorTexture,
  ITexture,
} from "../../models/texture.model";
import { BasicRenderer } from "../../renderer/basic-renderer";

export class SceneCreator {
  textures: ITexture[] = [];
  materials: IMaterial[] = [];
  shapes: IAbstractShape[] = [];
  camera: ICamera;

  constructor() {
    this.camera = {
      position: [-1.5, 0.5, 0],
      lookAt: [0, 0, -1],
      up: [0, 1, 0],
      vfov: 75,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };
  }

  get textureId() {
    return this.textures.length;
  }

  get materialId() {
    return this.materials.length;
  }

  get shapeId() {
    return this.shapes.length;
  }

  generate() {
    const groundColor: ISolidColorTexture = {
      id: 0,
      name: "tex1",
      type: "solid",
      color: [0.8, 0.8, 0],
    };
    this.textures.push(groundColor);

    const mat1: ILambertianMaterial = {
      id: 0,
      name: "mat1",
      type: "lambertian",
      textureId: 0,
    };
    this.materials.push(mat1);

    const s1: ISphere = {
      type: "sphere",
      materialId: 0,
      center: [0, -1000, 0],
      radius: 1000,
    };
    this.shapes.push(s1);

    const color1: ISolidColorTexture = {
      id: 1,
      name: "color1",
      type: "solid",
      color: [0, 0.6, 0.2],
    };
    this.textures.push(color1);
    const metalMat: IMetalMaterial = {
      id: color1.id,
      name: "mat1",
      type: "metal",
      textureId: 1,
      fuzz: 0,
    };
    this.materials.push(metalMat);
    const rightSphere: ISphere = {
      type: "sphere",
      materialId: metalMat.id,
      center: [1, 0.5, -1],
      radius: 0.5,
    };
    this.shapes.push(rightSphere);

    // leftSphere
    const glassMat: IDielectricMaterial = {
      id: 2,
      name: "mat1",
      type: "dielectric",
      refractiveIndex: 1.5,
    };
    this.materials.push(glassMat);
    const leftSphere: ISphere = {
      type: "sphere",
      materialId: glassMat.id,
      center: [-1, 0.5, -1],
      radius: 0.5,
    };
    this.shapes.push(leftSphere);
    const leftSphereInner: ISphere = {
      type: "sphere",
      materialId: glassMat.id,
      center: [-1, 0.5, -1],
      radius: -0.45,
    };
    this.shapes.push(leftSphereInner);

    // center sphere
    const earthTex: IImageTexture = {
      id: this.textures.length,
      name: "tex1",
      type: "image",
      src: "/textures/earth.jpg",
    };
    this.textures.push(earthTex);

    const earthMat: ILambertianMaterial = {
      id: this.materials.length,
      name: "mat1",
      type: "lambertian",
      textureId: earthTex.id,
    };
    this.materials.push(earthMat);

    const centerSphere: ISphere = {
      type: "sphere",
      materialId: earthMat.id,
      center: [0, 0.5, -1],
      radius: 0.5,
    };
    this.shapes.push(centerSphere);
  }

  exportJson(): IScene {
    return {
      camera: this.camera,
      world: {
        textures: this.textures,
        materials: this.materials,
        shapes: this.shapes,
      },
    };
  }

  renderScene(canvas: Canvas) {
    this.generate();
    const sceneData = this.exportJson();
    console.log(sceneData);
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
