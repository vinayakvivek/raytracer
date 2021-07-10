import { useBvh } from "../config";
import { AABB } from "../core/aabb";
import { BvhNode } from "../core/bvh-node";
import { Ray } from "../core/ray";
import { Intersection } from "../models/intersection.model";
import { Point3, Vec3 } from "../utils";
import { AbstractShape } from "./abstract-shape";

export class GroupShape extends AbstractShape {
  shapes: AbstractShape[];
  bvhNode: BvhNode;
  unboundedShapes: AbstractShape[] = [];
  enableBvh = false;

  constructor(shapes: AbstractShape[], shouldCreateBvh = true) {
    super();
    this.shapes = shapes;
    if (shouldCreateBvh && useBvh && this.createBvh()) {
      this.boundingBox = this.bvhNode.boundingBox;
    } else {
      // if BVH is not enabled, all shapes are unbounded
      this.unboundedShapes = this.shapes;
      this.boundingBox = null;
    }
  }

  createBvh() {
    this.unboundedShapes = this.shapes.filter((s) => !s.boundingBox);
    const boundedShapes = this.shapes.filter((s) => !!s.boundingBox);
    if (boundedShapes.length > 0) {
      this.bvhNode = new BvhNode(boundedShapes);
      this.enableBvh = true;
      return true;
    }
    return false;
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

  pdfValue(o: Point3, v: Vec3): number {
    if (!this.shapes.length) return 0;
    const w = 1 / this.shapes.length;
    let sum = 0;
    for (const shape of this.shapes) {
      sum += w * shape.pdfValue(o, v);
    }
    return sum;
  }

  random(o: Vec3) {
    const randIndex = Math.floor(Math.random() * this.shapes.length);
    return this.shapes[randIndex].random(o);
  }
}
