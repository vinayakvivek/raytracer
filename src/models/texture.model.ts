import { Array3 } from "../utils";

export interface ITexture {}

export interface ISolidColorTexture extends ITexture {
  color: Array3;
}
