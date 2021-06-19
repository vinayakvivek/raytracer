import { AABB } from "../../core/aabb";
import { Ray } from "../../core/ray";
import { MaterialFactory } from "../../materials/factory";
import { Intersection } from "../../models/intersection.model";
import {
  IAbstractShape,
  IBox,
  IGroupShape,
  IRectangle,
  ITranslate,
} from "../../models/shape.model";
import { Point3, Vec3 } from "../../utils";
import { ShapeFactory } from "../factory";
import { GroupShape } from "../group";
import { MaterialShape } from "./material-shape";

export class Box extends MaterialShape {
  size: Vec3;
  group: GroupShape;

  constructor(
    props: IBox,
    materialFactory: MaterialFactory,
    shapeFactory: ShapeFactory
  ) {
    super(props, materialFactory);
    this.size = Vec3.fromJson(props.size);
    this.group = <GroupShape>(
      shapeFactory.create(
        this._createBox(this.size.x, this.size.y, this.size.z)
      )
    );
    this.boundingBox = props.unbounded ? null : this._boundingBox();
  }

  _createBox(x: number, y: number, z: number): IGroupShape {
    const z1 = this._createSide(x, y, 0, 0);
    const z2 = this._createSide(x, y, z, 0);

    const y1 = this._createSide(z, x, 0, 2);
    const y2 = this._createSide(z, x, y, 2);

    const x1 = this._createSide(y, z, 0, 1);
    const x2 = this._createSide(y, z, x, 1);
    return {
      type: "group",
      shapes: [z1, z2, y1, y2, x1, x2],
    };
  }

  _createSide(w: number, h: number, d: number, p: 0 | 1 | 2): IAbstractShape {
    let rect = <IRectangle>{
      type: "rectangle",
      materialId: this.material.id,
      width: w,
      height: h,
      plane: p,
    };
    if (d > 0) {
      const t = <ITranslate>{
        type: "translation",
        shape: rect,
      };
      if (p == 0) t.z = d;
      else if (p == 1) t.x = d;
      else t.y = d;
      return t;
    }
    return rect;
  }

  _boundingBox(): AABB {
    return new AABB(new Point3(), this.size.clone());
  }

  intersect(ray: Ray, tMin: number, tMax: number): Intersection {
    return this.group.intersect(ray, tMin, tMax);
  }
}
