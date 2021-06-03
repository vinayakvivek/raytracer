import { size } from "./config";
import "./style.css";
import Canvas from './utils/canvas';

const { width, height } = size;
const canvas = new Canvas(width, height);

for (let x = 0; x < width; ++x) {
  for (let y = 0; y < height; ++y) {
    canvas.setPixel(x, y, x / width, y / height, 0.25);
  }
}
canvas.writeImage();
