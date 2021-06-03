import { CANVAS_ID } from "../constants";
import { Color } from '../utils';

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
    const index = (y * this.width + x) * 4;
    this.imageData.data[index] = 255 * color.r;
    this.imageData.data[index + 1] = 255 * color.g;
    this.imageData.data[index + 2] = 255 * color.b;
    this.imageData.data[index + 3] = 255 * a;
  }

  writeImage() {
    this.context.putImageData(this.imageData, 0, 0);
  }

}

export { Canvas };
