import { fork } from "child_process";
import path from "path/posix";
import sharp from "sharp";
import { IScene, Offset, Size } from "./models/scene.model";

interface Part {
  path: string;
  offset: Offset;
  size: Size;
}

export class WorkerCreator {
  sceneData: IScene;
  n: number;
  fullSize: Size;
  parts: Part[] = [];
  activeCount = 0;

  // n => number of divisions on one side, n x n division
  constructor(sceneData: IScene, n: number, size: Size) {
    this.sceneData = sceneData;
    this.n = n;
    this.fullSize = size;
  }

  createWorker(id: number, offset: Offset, size: Size) {
    const savePath = `./out/${this.sceneData.name}/p${id}/`;
    this.parts.push({ path: savePath, offset, size });
    const worker = fork(path.join(__dirname, "worker.ts"));
    worker.send({
      id,
      sceneData: this.sceneData,
      offset,
      size,
      fullSize: this.fullSize,
      savePath,
    });
    this.activeCount++;
    worker.on("message", (data: any) => {
      if (data.done) {
        console.log(`worker-${id} done.`);
        worker.kill();
        this.activeCount--;
        if (this.activeCount == 0) {
          this.merge();
        }
      }
    });
  }

  partition(n: number) {
    const w = Math.floor(this.fullSize.width / n);
    const h = Math.floor(this.fullSize.height / n);
    const size = { width: w, height: h };
    let count = 0;
    for (let j = 0; j < n; ++j) {
      for (let i = 0; i < n; ++i) {
        this.createWorker(count++, { x: i * w, y: (n - j - 1) * h }, size);
      }
    }
  }

  async merge() {
    console.log("merging ...");
    const { data, info } = await sharp({
      create: {
        width: this.fullSize.width,
        height: this.fullSize.height,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixels = new Uint8ClampedArray(data.buffer);
    for (const part of this.parts) {
      const partImg = await sharp(path.join(part.path, "latest.jpg"))
        .raw()
        .toBuffer({ resolveWithObject: true });
      const partPixels = new Uint8ClampedArray(partImg.data.buffer);
      for (let j = 0; j < part.size.height; ++j) {
        const y =
          (j + (part.size.height - part.offset.y - 1)) * this.fullSize.width;
        for (let i = 0; i < part.size.width; ++i) {
          const x = i + part.offset.x;
          const index = (y + x) * 3;
          const imgIndex = (j * part.size.width + i) * 3;
          pixels[index] = partPixels[imgIndex];
          pixels[index + 1] = partPixels[imgIndex + 1];
          pixels[index + 2] = partPixels[imgIndex + 2];
        }
      }
    }

    const finalPath = `./out/${this.sceneData.name}/final.jpg`;
    console.log(`saving final image at ${finalPath}`);
    sharp(Buffer.from(pixels), {
      raw: {
        width: this.fullSize.width,
        height: this.fullSize.height,
        channels: 3,
      },
    }).toFile(finalPath);
  }

  render() {
    this.partition(this.n);
  }
}
