import { size } from "./config";
import "./style.css";
import { Canvas, Color, sleep } from './utils';

const { width, height } = size;
const canvas = new Canvas(width, height);

(async () => {
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      canvas.setPixel(x, y, new Color(x / width, y / height, 0.25));
    }
    canvas.writeImage();
    // await sleep(0);
  }
})();

