import { Vec3 } from "../utils";
import { ONB } from "../utils/onb";
import { PDF } from "./pdf";

export class CosinePDF extends PDF {
  uvw: ONB;

  constructor(w: Vec3) {
    super();
    this.uvw = new ONB(w);
  }

  value(direction: Vec3): number {
    const cosine = direction.clone().normalize().dot(this.uvw.w);
    return cosine <= 0 ? 0 : cosine / Math.PI;
  }

  generate(): Vec3 {
    return this.uvw.local(Vec3.randomCosineDirection());
  }
}
