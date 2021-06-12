import { useBvh } from "../config";
import { Intersection, Shape } from "../shape/shape";
import { BvhNode } from "./bvh-node";
import { Ray } from "./ray";

export class World {
  shapes: Shape[] = [];
  bvhNode: BvhNode;
  unboundedShapes: Shape[] = [];

  constructor(shapes: Shape[]) {
    this.shapes = shapes;
    if (useBvh) {
      this.createBvh();
    } else {
      // if BVH is not enabled, all shapes are unbounded
      this.unboundedShapes = this.shapes;
    }
  }

  addShape(...shapes: Shape[]) {
    this.shapes.push(...shapes);
  }

  clearShapes() {
    this.shapes = [];
  }

  createBvh() {
    this.unboundedShapes = this.shapes.filter((s) => !s.boundingBox);
    const boundedShapes = this.shapes.filter((s) => !!s.boundingBox);
    this.bvhNode = new BvhNode(boundedShapes);
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
}
