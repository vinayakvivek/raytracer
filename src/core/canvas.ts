import sharp from "sharp";
import { clamp, Color } from "../utils";
import fs from "fs";
import path from "path";
import { saveAtSamples, saveSteps } from "../config";

class Canvas {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  saveDir: string;

  constructor(width: number, height: number, saveDir: string) {
    this.width = width;
    this.height = height;
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
    this.saveDir = saveDir;
  }

  async init() {
    const { data, info } = await sharp({
      create: {
        width: this.width,
        height: this.height,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .raw()
      .toBuffer({ resolveWithObject: true });

    this.pixels = new Uint8ClampedArray(data.buffer);
  }

  _getIndex(x: number, y: number) {
    // invert y
    y = this.height - y - 1;
    return (y * this.width + x) * 3;
  }

  // all between 0 -> 1
  setPixel(x: number, y: number, color: Color, a = 1.0) {
    const index = this._getIndex(x, y);

    // remove gamma correction
    const r = Math.sqrt(color.x);
    const g = Math.sqrt(color.y);
    const b = Math.sqrt(color.z);
    // const r = color.r;
    // const g = color.g;
    // const b = color.b;

    this.pixels[index] = 255 * clamp(r, 0, 1);
    this.pixels[index + 1] = 255 * clamp(g, 0, 1);
    this.pixels[index + 2] = 255 * clamp(b, 0, 1);
  }

  getPixel(x: number, y: number): Color {
    const index = this._getIndex(x, y);
    const r = this.pixels[index] / 255;
    const g = this.pixels[index + 1] / 255;
    const b = this.pixels[index + 2] / 255;
    return new Color(r * r, g * g, b * b);
  }

  updatePixel(x: number, y: number, color: Color, numSamples: number) {
    const currColor = this.getPixel(x, y);
    currColor
      .multScalar(numSamples - 1)
      .add(color)
      .divScalar(numSamples);
    this.setPixel(x, y, currColor);
  }

  _writeToFile(fileName: string) {
    sharp(Buffer.from(this.pixels), {
      raw: { width: this.width, height: this.height, channels: 3 },
    }).toFile(fileName);
  }

  writeImage(spp = 1) {
    const latest = path.join(this.saveDir, `latest.jpg`);
    this._writeToFile(latest);
    if (!saveSteps) return;
    if (spp < 10 || (spp < 100 && spp % 10 == 0) || spp % saveAtSamples == 0) {
      const savePath = path.join(this.saveDir, `${spp}-spp.jpg`);
      console.log(`saving: ${savePath}`);
      this._writeToFile(savePath);
    }
  }
}

export { Canvas };
