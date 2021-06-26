import sharp from "sharp";
import { clamp, Color } from "../utils";
import fs from "fs";
import path from "path";
import { continueRender, saveAtSamples, saveSteps } from "../config";

interface ImageMetadata {
  samples: number;
}

class Canvas {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  saveDir: string;
  metadata: ImageMetadata;

  // file paths
  latestPath: string;
  metadataPath: string;

  constructor(width: number, height: number, saveDir: string) {
    this.width = width;
    this.height = height;
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
    this.saveDir = saveDir;
    this.metadata = {
      samples: 0,
    };

    this.latestPath = path.join(this.saveDir, `latest.png`);
    this.metadataPath = path.join(this.saveDir, "metadata.json");
  }

  async init() {
    if (continueRender && fs.existsSync(this.latestPath)) {
      const latestImg = await sharp(this.latestPath)
        .raw()
        .toBuffer({ resolveWithObject: true });
      this.pixels = new Uint8ClampedArray(latestImg.data.buffer);
      if (fs.existsSync(this.metadataPath)) {
        this.metadata = JSON.parse(
          fs.readFileSync(this.metadataPath).toString()
        );
        if (!this.metadata.samples) {
          this.metadata.samples = 0;
        }
      }
      console.log(
        `image exists at ${this.latestPath}, numSamples: ${this.metadata.samples}`
      );
    } else {
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
    return this.metadata.samples;
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

  updatePixel(x: number, y: number, color: Color) {
    const n = this.metadata.samples;
    const currColor = this.getPixel(x, y);
    currColor
      .multScalar(n)
      .add(color)
      .divScalar(n + 1);
    this.setPixel(x, y, currColor);
  }

  _writeToFile(fileName: string) {
    return sharp(Buffer.from(this.pixels), {
      raw: { width: this.width, height: this.height, channels: 3 },
    }).toFile(fileName);
  }

  writeImage(spp = 1) {
    this.metadata.samples++;
    fs.writeFileSync(this.metadataPath, JSON.stringify(this.metadata));
    return this._writeToFile(this.latestPath);
    // if (!saveSteps) return;
    // if (spp < 10 || (spp < 100 && spp % 10 == 0) || spp % saveAtSamples == 0) {
    //   const savePath = path.join(this.saveDir, `${spp}-spp.jpg`);
    //   console.log(`saving: ${savePath}`);
    //   this._writeToFile(savePath);
    // }
  }
}

export { Canvas };
