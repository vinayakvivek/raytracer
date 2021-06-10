import { useBvh } from "../config";
import { IWorld } from "../models/scene.model";
import { ShapeFactory } from "../shape/factory";
import { Intersection, Shape } from "../shape/shape";
import { BvhNode } from "./bvh-node";
import { Ray } from "./ray";

export class World {
  shapes: Shape[] = [];
  bvhNode: BvhNode;
  unboundedShapes: Shape[] = [];

  constructor() {}

  addShape(...shapes: Shape[]) {
    this.shapes.push(...shapes);
  }

  clearShapes() {
    this.shapes = [];
  }

  createBvh() {
    if (useBvh) {
      this.unboundedShapes = this.shapes.filter((s) => !s.boundingBox);
      const boundedShapes = this.shapes.filter((s) => !!s.boundingBox);
      this.bvhNode = new BvhNode(boundedShapes);
    } else {
      this.unboundedShapes = this.shapes;
    }
  }

  // seems like intersecting BVH first gives better performance
  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    let closest: Intersection = { valid: false, t: tMax };
    if (useBvh) {
      closest = this.bvhNode.intersect(ray, tMin, tMax);
    }
    this.unboundedShapes.forEach((shape) => {
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
