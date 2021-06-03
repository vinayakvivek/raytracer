import { CANVAS_ID } from "../constants";
import { clamp, Color } from '../utils';

class Canvas {

  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  imageData: ImageData;  // ImageData.data


  constructor(width: number, height: number) {
    const canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
    canvas.width = width;
    canvas.height = height;
    this.width = width;
    this.height = height;

    this.context = canvas.getContext("2d");
    this.imageData = this.context.createImageData(width, height);
    for (let i = 0; i < width * height * 4; ++i) {
      this.imageData.data[i] = 0;
    }
  }

  // all between 0 -> 1
  setPixel(x: number, y: number, color: Color, a = 1.0) {
    // invert y
    y = this.height - y - 1;

    const index = (y * this.width + x) * 4;

    // remove gamma correction
    const r = Math.sqrt(color.r);
    const g = Math.sqrt(color.g);
    const b = Math.sqrt(color.b);

    this.imageData.data[index] = 255 * clamp(r, 0, 1);
    this.imageData.data[index + 1] = 255 * clamp(g, 0, 1);
    this.imageData.data[index + 2] = 255 * clamp(b, 0, 1);
    this.imageData.data[index + 3] = 255 * a;
  }

  writeImage() {
    this.context.putImageData(this.imageData, 0, 0);
  }

}

export { Canvas };
