import { Canvas } from "../core/canvas";
import RenderWorker from "worker-loader!./worker";

export class WorkerRenderer {
  canvas: Canvas;
  width: number;
  height: number;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  async render() {
    const worker = new RenderWorker();
    worker.postMessage({
      width: this.width,
      height: this.height,
    });
    worker.onmessage = (event) => {
      const colors = event.data.colors;
      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          this.canvas.setPixel(x, y, colors[x][y]);
        }
      }
      this.canvas.writeImage();
    };
  }
}
