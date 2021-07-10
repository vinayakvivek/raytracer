import { MaterialFactory } from "../materials/factory";
import { IScene } from "../models/scene.model";
import { AbstractShape } from "../shape/abstract-shape";
import { ShapeFactory } from "../shape/factory";
import { TextureFactory } from "../textures/factory";
import { Color } from "../utils";
import { LoadingManager } from "../utils/loading-manager";
import { Camera } from "./camera";
import { World } from "./world";

export class Scene {
  world: World;
  camera: Camera;
  background: Color;
  loadingManager: LoadingManager;

  constructor(data: IScene) {
    this.loadingManager = new LoadingManager();
    this.parseScene(data);
  }

  get isLoading() {
    return this.loadingManager.isLoading;
  }

  setOnLoad(onLoad: () => void) {
    this.loadingManager.onLoad = onLoad;
  }

  parseScene = (data: IScene) => {
    this.background = new Color(1, 1, 1); // white background
    if (data.background) {
      this.background = Color.fromJson(data.background);
    }

    const textureFactory = new TextureFactory(this.loadingManager);
    for (const textureData of data.world.textures) {
      textureFactory.create(textureData);
    }

    const materialFactory = new MaterialFactory(textureFactory);
    for (const materialData of data.world.materials) {
      materialFactory.create(materialData);
    }

    const shapeFactory = new ShapeFactory(materialFactory);
    for (const shapeData of data.world.shapes) {
      shapeFactory.createAndPush(shapeData);
    }

    const lights: AbstractShape[] = [];
    for (const id of data.world.lightIds) {
      lights.push(shapeFactory.shapes[id]);
    }

    this.world = new World(shapeFactory.shapes, lights);
    this.camera = new Camera(data.camera);
  };
}
