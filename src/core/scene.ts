import { MaterialFactory } from "../materials/factory";
import { IScene } from "../models/scene.model";
import { ShapeFactory } from "../shape/factory";
import { TextureFactory } from "../textures/factory";
import { LoadingManager } from "../utils/loading-manager";
import { Camera } from "./camera";
import { World } from "./world";

export class Scene {
  world: World;
  camera: Camera;
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
    console.log("Parsing scene ..");
    const textureFactory = new TextureFactory(this.loadingManager);
    for (const textureData of data.world.textures) {
      console.log(`Creating texture: ${textureData.name}`);
      textureFactory.create(textureData);
    }

    const materialFactory = new MaterialFactory(textureFactory);
    for (const materialData of data.world.materials) {
      console.log(`Creating material: ${materialData.name}`);
      materialFactory.create(materialData);
    }

    const shapeFactory = new ShapeFactory(materialFactory);
    for (const shapeData of data.world.shapes) {
      console.log(`Creating shape: ${shapeData.name}`);
      shapeFactory.create(shapeData);
    }

    const shapes = Object.values(shapeFactory.shapes);
    this.world = new World(shapes);
    this.camera = new Camera(data.camera);
  };
}
