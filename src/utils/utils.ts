export const sleep = (ms: number) => {
  return new Promise(res => setTimeout(res, ms));
}

export const degToRad = (degrees: number) => degrees * Math.PI / 180.0;
