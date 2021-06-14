import { useBvh } from "../config";
import { Intersection } from "../models/intersection.model";
import { AbstractShape } from "../shape/abstract-shape";
import { BvhNode } from "./bvh-node";
import { Ray } from "./ray";

export class World {
  shapes: AbstractShape[] = [];
  bvhNode: BvhNode;
  unboundedShapes: AbstractShape[] = [];
  enableBvh = false;

  constructor(shapes: AbstractShape[]) {
    this.shapes = shapes;
    if (useBvh) {
      this.createBvh();
    } else {
      // if BVH is not enabled, all shapes are unbounded
      this.unboundedShapes = this.shapes;
    }
  }

  addShape(...shapes: AbstractShape[]) {
    this.shapes.push(...shapes);
  }

  clearShapes() {
    this.shapes = [];
  }

  createBvh() {
    this.unboundedShapes = this.shapes.filter((s) => !s.boundingBox);
    const boundedShapes = this.shapes.filter((s) => !!s.boundingBox);
    if (boundedShapes.length > 0) {
      this.bvhNode = new BvhNode(boundedShapes);
      this.enableBvh = true;
    }
  }

  // seems like intersecting BVH first gives better performance
  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    let closest: Intersection = { valid: false, t: tMax };
    if (this.enableBvh) {
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
