export type ShapeType = "sphere" | "plane";
export type MaterialType = "lambertian" | "metal" | "dielectric";

export interface Material {
  type: MaterialType;
}
