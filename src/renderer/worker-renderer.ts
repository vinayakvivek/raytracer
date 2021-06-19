import { Canvas } from "../core/canvas";
import RenderWorker from "worker-loader!./worker";
import { IScene } from "../models/scene.model";

export class WorkerRenderer {
  canvas: Canvas;
  sceneData: any;
  width: number;
  height: number;

  constructor(canvas: Canvas, sceneData: IScene) {
    this.sceneData = sceneData;
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  createWorker(
    offset: { x: number; y: number },
    dim: { width: number; height: number }
  ) {
    const worker = new RenderWorker();
    worker.postMessage({
      sceneData: this.sceneData,
      offset,
      dim,
      fullWidth: this.width,
      fullHeight: this.height,
    });
    worker.onmessage = (event) => {
      if (event.data.done) {
        worker.terminate();
        return;
      }
      const colors = event.data.colors;
      for (let x = 0; x < dim.width; ++x) {
        for (let y = 0; y < dim.height; ++y) {
          this.canvas.setPixel(x + offset.x, y + offset.y, colors[x][y]);
        }
      }
      this.canvas.writeImage();
    };
  }

  partition(n = 2) {
    const w = Math.floor(this.width / n);
    const h = Math.floor(this.height / n);
    const dim = { width: w, height: h };
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        this.createWorker({ x: i * w, y: j * h }, dim);
      }
    }
  }

  render() {
    this.partition(2);
  }
}
