import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { Material } from "../../materials/material";
import { UV, Intersection } from "../../models/intersection.model";
import { IMaterialShape } from "../../models/shape.model";
import { Point3 } from "../../utils";
import { UnimplementedError } from "../../utils/errors";
import { AbstractShape } from "../abstract-shape";

export class MaterialShape extends AbstractShape {
  material: Material;

  constructor(props: IMaterialShape, materialFactory: MaterialFactory) {
    super();
    this.material = materialFactory.getById(props.materialId);
  }

  getUV(p: Point3): UV {
    throw new UnimplementedError();
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    throw new UnimplementedError();
  }
}
