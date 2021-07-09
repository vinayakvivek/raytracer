import { Vec3 } from "../utils";
import { UnimplementedError } from "../utils/errors";

export class PDF {
  value(direction: Vec3): number {
    throw new UnimplementedError();
  }

  generate(): Vec3 {
    throw new UnimplementedError();
  }
}
