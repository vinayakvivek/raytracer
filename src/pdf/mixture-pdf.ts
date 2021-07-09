import { Vec3 } from "../utils";
import { PDF } from "./pdf";

export class MixturePDF extends PDF {
  p0: PDF;
  p1: PDF;
  mix = 0.5;

  constructor(p0: PDF, p1: PDF) {
    super();
    this.p0 = p0;
    this.p1 = p1;
  }

  value(direction: Vec3): number {
    return (
      this.mix * this.p0.value(direction) +
      (1 - this.mix) * this.p1.value(direction)
    );
  }

  generate(): Vec3 {
    return Math.random() < this.mix ? this.p0.generate() : this.p1.generate();
  }
}
