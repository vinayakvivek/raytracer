import { roundTo2 } from "./utils";

export type Array2 = [number, number];

export class Vec2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toJson(): Array2 {
    return [roundTo2(this.x), roundTo2(this.y)];
  }

  static fromJson(v: Array2) {
    return new Vec2(v[0], v[1]);
  }
}

export { Vec2 as Point2 };
