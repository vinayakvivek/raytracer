import { size } from "./config";
import "./style.css";

const { width, height } = size;
const canvas = document.getElementById("viewport");
canvas.width = width;
canvas.height = height;

const context = canvas.getContext("2d");
const imageData = context.createImageData(width, height);

for (let i = 0; i < width; ++i) {
  for (let j = 0; j < height; ++j) {
    var pi = ((height - j - 1) * width + i) * 4; // pixel index
    const r = i / (width - 1);
    const g = j / (height - 1);
    const b = 0.25;
    imageData.data[pi] = 255.999 * r;
    imageData.data[pi + 1] = 255.999 * g;
    imageData.data[pi + 2] = 255.999 * b;
    imageData.data[pi + 3] = 255;
  }
}

context.putImageData(imageData, 0, 0);
