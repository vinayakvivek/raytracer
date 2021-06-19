import { Canvas } from "../../core/canvas";
import {
  IDielectricMaterial,
  ILambertianMaterial,
  IMaterial,
  IMetalMaterial,
  MaterialType,
} from "../../models/material.model";
import { ICamera, IScene } from "../../models/scene.model";
import {
  IAbstractShape,
  IConstantMedium,
  ISphere,
  ITransform,
  ITransformItem,
  ITransformShape,
  ShapeType,
} from "../../models/shape.model";
import {
  IImageTexture,
  ISolidColorTexture,
  ITexture,
  TextureType,
} from "../../models/texture.model";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { Array3 } from "../../utils";

export class SceneCreator {
  textures: ITexture[] = [];
  materials: IMaterial[] = [];
  shapes: IAbstractShape[] = [];
  camera: ICamera;
  background: Array3 = [1, 1, 1];

  constructor() {
    this.camera = {
      position: [-3, 0.5, 1],
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

  texture(type: TextureType, props: any, name = ""): ITexture {
    const texture = {
      ...props,
      id: this.textureId,
      name,
      type,
    };
    this.textures.push(texture);
    return texture;
  }

  material(
    type: MaterialType,
    texture: ITexture | null,
    props: any,
    name = ""
  ): IMaterial {
    const material = {
      ...props,
      id: this.materialId,
      name,
      type,
      textureId: texture?.id,
    };
    this.materials.push(material);
    return material;
  }

  shape(
    type: ShapeType,
    material: IMaterial,
    props: any,
    transforms: ITransformItem[] = [],
    transient = false
  ): IAbstractShape {
    let shape = {
      ...props,
      type,
      materialId: material.id,
    };
    if (transforms.length) {
      shape = {
        type: "transform",
        transforms,
        shape,
      };
    }
    if (!transient) this.shapes.push(shape);
    return shape;
  }

  constantMedium(density: number, texture: ITexture, boundary: IAbstractShape) {
    const shape = <IConstantMedium>{
      type: "constant-medium",
      density,
      textureId: texture.id,
      boundary,
    };
    this.shapes.push(shape);
    return shape;
  }

  solidTexture(color: Array3): ITexture {
    return this.texture("solid", { color });
  }

  imageTexture(src: string): ITexture {
    return this.texture("image", { src });
  }

  diffuseMaterial(color: Array3): IMaterial {
    const texture = this.solidTexture(color);
    return this.material("lambertian", texture, {});
  }

  metalMaterial(color: Array3, fuzz = 0): IMaterial {
    const texture = this.solidTexture(color);
    return this.material("metal", texture, { fuzz });
  }

  glassMaterial(ri = 1.5) {
    return this.material("dielectric", null, { refractiveIndex: ri });
  }

  light(color: Array3) {
    return this.material("diffuse-light", this.solidTexture(color), {});
  }

  transform(shape: IAbstractShape): ITransform {
    if (shape.type === "transform") return <ITransform>shape;
    return {
      type: "transform",
      transforms: [],
      shape,
    };
  }

  translate(x = 0, y = 0, z = 0): ITransformItem {
    return { type: "translation", x, y, z };
  }

  rotate(axis: "x" | "y" | "z", angle: number): ITransformItem {
    return { type: "rotation", axis, angle };
  }

  generate() {
    const groundMaterial = this.diffuseMaterial([0.4, 0.1, 0.5]);
    const ground = this.shape("sphere", groundMaterial, {
      center: [0, -1000, 0],
      radius: 1000,
    });

    const metalMat = this.metalMaterial([0, 0.6, 0.8]);
    const rightSphere = this.shape("sphere", metalMat, {
      center: [1, 0.5, -1],
      radius: 0.5,
    });

    // leftSphere
    const glassMat = this.glassMaterial();
    const leftSphere = this.shape("sphere", glassMat, {
      center: [-1, 0.5, -1],
      radius: 0.5,
    });
    const leftSphereInner = this.shape("sphere", glassMat, {
      center: [-1, 0.1, 0.5],
      radius: 0.25,
    });

    // center sphere
    const earthTexture = this.imageTexture("/textures/earth.jpg");
    const earthMat = this.material("lambertian", earthTexture, {});
    const centerSphere = this.shape("sphere", earthMat, {
      center: [0, 0.5, -1],
      radius: 0.5,
    });
  }

  exportJson(): IScene {
    return {
      camera: this.camera,
      background: this.background,
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
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
