import { useBvh } from "../config";
import { IWorld } from "../models/scene.model";
import { ShapeFactory } from "../shape/factory";
import { Intersection, Shape } from "../shape/shape";
import { BvhNode } from "./bvh-node";
import { Ray } from "./ray";

export class World {
  shapes: Shape[] = [];
  bvhNode: BvhNode;

  constructor() {}

  addShape(...shapes: Shape[]) {
    this.shapes.push(...shapes);
  }

  clearShapes() {
    this.shapes = [];
  }

  createBvh() {
    if (!useBvh) return;
    this.bvhNode = new BvhNode(this.shapes);
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    if (useBvh) {
      return this.bvhNode.intersect(ray, tMin, tMax);
    }
    let closest: Intersection = { valid: false, t: tMax };
    this.shapes.forEach((shape) => {
      const intersection = shape.intersect(ray, tMin, closest.t);
      if (intersection.valid) {
        closest = intersection;
      }
    });
    return closest;
  }

  toJson(): IWorld {
    return {
      shapes: this.shapes.map((s) => s.toJson()),
    };
  }

  static fromJson(data: IWorld) {
    const w = new World();
    for (const shapeData of data.shapes) {
      w.addShape(ShapeFactory.fromJson(shapeData));
    }
    return w;
  }
}
