import { Color } from "./vec3";

export const sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

export const degToRad = (degrees: number) => (degrees * Math.PI) / 180.0;

// just adding here so that it'll be easier if we want to update
// the random number generation algorithm
export const random = () => Math.random();

export const randomBetween = (min: number, max: number) => {
  return min + (max - min) * random();
};

export const clamp = (x: number, min: number, max: number) => {
  return x < min ? min : x > max ? max : x;
};

export const randomColor = () => new Color(random(), random(), random());

export const randomColorBetween = (min: number, max: number) =>
  new Color(
    randomBetween(min, max),
    randomBetween(min, max),
    randomBetween(min, max)
  );

export const downloadData = (data: any) => {
  const fileName = "scene";
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
