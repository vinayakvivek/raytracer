import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { Intersection } from "../../models/intersection.model";
import { IBox } from "../../models/shape.model";
import { Vec3 } from "../../utils";
import { UnimplementedError } from "../../utils/errors";
import { MaterialShape } from "./material-shape";

export class Box extends MaterialShape {
  size: Vec3;

  constructor(props: IBox, materialFactory: MaterialFactory) {
    super(props, materialFactory);
    this.size = Vec3.fromJson(props.size);
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    throw new UnimplementedError();
  }
}
