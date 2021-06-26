import { fork } from "child_process";
import path from "path/posix";
import { IScene, Offset, Size } from "./models/scene.model";

export class WorkerCreator {
  sceneData: IScene;
  n: number;
  fullSize: Size;

  // n => number of divisions on one side, n x n division
  constructor(sceneData: IScene, n: number, size: Size) {
    this.sceneData = sceneData;
    this.n = n;
    this.fullSize = size;
  }

  createWorker(id: number, offset: Offset, size: Size) {
    const worker = fork(path.join(__dirname, "worker.ts"));
    worker.send({
      id,
      sceneData: this.sceneData,
      offset,
      size,
      fullSize: this.fullSize,
    });
    worker.on("message", (data) => {
      console.log(data);
    });
  }

  partition(n: number) {
    const w = Math.floor(this.fullSize.width / n);
    const h = Math.floor(this.fullSize.height / n);
    const size = { width: w, height: h };
    let count = 0;
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        this.createWorker(count++, { x: i * w, y: j * h }, size);
      }
    }
  }

  render() {
    this.partition(this.n);
  }
}
