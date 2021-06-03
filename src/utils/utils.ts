export const sleep = (ms: number) => {
  return new Promise(res => setTimeout(res, ms));
}

export const degToRad = (degrees: number) => degrees * Math.PI / 180.0;

// just adding here so that it'll be easier if we want to update
// the random number generation algorithm
export const random = () => Math.random();

export const randomBetween = (min: number, max: number) => {
  return min + (max - min) * random();
}

export const clamp = (x: number, min: number, max: number) => {
  return x < min ? min : (x > max ? max: x);
}
