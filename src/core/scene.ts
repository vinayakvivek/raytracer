import { MaterialFactory } from "../materials/factory";
import { IScene } from "../models/scene.model";
import { ShapeFactory } from "../shape/factory";
import { TextureFactory } from "../textures/factory";
import { Camera } from "./camera";
import { World } from "./world";

export class Scene {
  world: World;
  camera: Camera;

  constructor(data: IScene) {
    this.parseScene(data);
  }

  parseScene = (data: IScene) => {
    const textureFactory = new TextureFactory();
    for (const textureData of data.world.textures) {
      textureFactory.create(textureData);
    }

    const materialFactory = new MaterialFactory(textureFactory);
    for (const materialData of data.world.materials) {
      materialFactory.create(materialData);
    }

    const shapeFactory = new ShapeFactory(materialFactory);
    for (const shapeData of data.world.shapes) {
      shapeFactory.create(shapeData);
    }

    const shapes = Object.values(shapeFactory.shapes);
    this.world = new World(shapes);
    this.camera = new Camera(data.camera);
  };
}
