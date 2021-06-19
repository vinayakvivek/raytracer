import sharp from "sharp";
import { UV } from "../models/intersection.model";
import { IImageTexture } from "../models/texture.model";
import { Array3, clamp, Color, Point3 } from "../utils";
import { LoadingManager } from "../utils/loading-manager";
import { Texture } from "./texture";

type OnLoadCallback = (texture: ImageTexture) => void;

export class ImageTexture extends Texture {
  src: string;
  width: number;
  height: number;
  numChannels: number;
  pixels: Uint8ClampedArray;
  onLoad: OnLoadCallback;

  constructor(props: IImageTexture, loadingManager: LoadingManager) {
    super(props);
    this.src = props.src;
    const loadId = loadingManager.addItem(`Image: ${this.src}`);

    sharp(this.src)
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        this.width = info.width;
        this.height = info.height;
        this.numChannels = info.channels;
        this.pixels = new Uint8ClampedArray(data.buffer);

        loadingManager.itemLoaded(loadId);
        if (this.onLoad) {
          this.onLoad(this);
        }
      });
  }

  _getPixel(x: number, y: number): Array3 {
    const index = (y * this.width + x) * this.numChannels;
    return [this.pixels[index], this.pixels[index + 1], this.pixels[index + 2]];
  }

  value(uv: UV, p: Point3): Color {
    if (!this.pixels) {
      console.warn("[ImageTexture] context not defined");
      return new Color(0, 1, 1);
    }
    const u = clamp(uv.u, 0, 1);
    const v = 1 - clamp(uv.v, 0, 1);

    let i = Math.floor(u * this.width);
    let j = Math.floor(v * this.height);
    if (i >= this.width) i = this.width - 1;
    if (j >= this.height) j = this.height - 1;

    const pixel = this._getPixel(i, j);
    const colorScale = 1 / 255;
    return new Color(pixel[0], pixel[1], pixel[2]).multScalar(colorScale);
  }
}
