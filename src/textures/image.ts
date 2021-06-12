import { loadingManager } from "../config";
import { IImageTexture } from "../models/texture.model";
import { UV } from "../shape/shape";
import { clamp, Color, Point3 } from "../utils";
import { Texture } from "./texture";

type OnLoadCallback = (texture: ImageTexture) => void;

export class ImageTexture extends Texture {
  src: string;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(props: IImageTexture, onLoad: OnLoadCallback = () => {}) {
    super(props);
    this.src = props.src;
    const loadId = loadingManager.addItem(`Image: ${this.src}`);
    const image = new Image();
    image.src = this.src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      this.width = canvas.width = image.width;
      this.height = canvas.height = image.height;
      this.context = canvas.getContext("2d");
      this.context.drawImage(image, 0, 0);
      loadingManager.itemLoaded(loadId);
      onLoad(this);
    };
  }

  value(uv: UV, p: Point3): Color {
    if (!this.context) {
      console.warn("[ImageTexture] context not defined");
      return new Color(0, 1, 1);
    }
    const u = clamp(uv.u, 0, 1);
    const v = 1 - clamp(uv.v, 0, 1);

    let i = Math.floor(u * this.width);
    let j = Math.floor(v * this.height);
    if (i >= this.width) i = this.width - 1;
    if (j >= this.height) j = this.height - 1;

    const pixel = this.context.getImageData(i, j, 1, 1).data;
    const colorScale = 1 / 255;
    return new Color(pixel[0], pixel[1], pixel[2]).multScalar(colorScale);
  }
}
