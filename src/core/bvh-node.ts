import { Intersection } from "../models/intersection.model";
import { AbstractShape } from "../shape/abstract-shape";
import { random } from "../utils";
import { AABB } from "./aabb";
import { Ray } from "./ray";

const shapeCompareX = (a: AbstractShape, b: AbstractShape) =>
  a.boundingBox.min.x < b.boundingBox.min.x ? -1 : 1;
const shapeCompareY = (a: AbstractShape, b: AbstractShape) =>
  a.boundingBox.min.y < b.boundingBox.min.y ? -1 : 1;
const shapeCompareZ = (a: AbstractShape, b: AbstractShape) =>
  a.boundingBox.min.z < b.boundingBox.min.z ? -1 : 1;

const randomShapeCompare = () => {
  const r = random();
  if (r < 0.4) return shapeCompareX;
  if (r < 0.8) return shapeCompareZ;
  return shapeCompareY;
};

/**
 * Keep a separate list for shapes with null boundingBox
 */
export class BvhNode {
  left: BvhNode | AbstractShape;
  right: BvhNode | AbstractShape;
  boundingBox: AABB;
  count: number;

  constructor(shapes: AbstractShape[]) {
    const n = shapes.length;
    this.count = n;
    if (n == 0) {
      console.error("Should not reach here");
      return;
    }
    if (n == 1) {
      this.left = this.right = shapes[0];
    } else if (n == 2) {
      [this.left, this.right] = shapes;
    } else {
      shapes.sort(randomShapeCompare());
      const lShapes = shapes.slice(0, n / 2);
      const rShapes = shapes.slice(n / 2);
      this.left = new BvhNode(lShapes);
      this.right = new BvhNode(rShapes);
    }
    const b1 = this.left.boundingBox;
    const b2 = this.right.boundingBox;
    this.boundingBox = AABB.surroundingBox(b1, b2);
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    if (!this.boundingBox.hit(ray, tMin, tMax)) {
      return { valid: false };
    }
    const iLeft = this.left.intersect(ray, tMin, tMax);
    if (iLeft.valid) {
      tMax = iLeft.t;
    }
    const iRight = this.right.intersect(ray, tMin, tMax);
    if (iRight.valid) return iRight;
    return iLeft;
  }
}
