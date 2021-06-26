import { Renderer } from "./renderer/renderer";

const colors = [
  "\x1b[31m",
  "\x1b[32m",
  "\x1b[33m",
  "\x1b[34m",
  "\x1b[35m",
  "\x1b[36m",
  "\x1b[37m",
];

process.on("message", (data) => {
  console.log(`starting worker: ${data.id}`);
  const { id, sceneData, size, offset, fullSize, savePath } = data;
  const renderer = new Renderer(
    sceneData,
    fullSize,
    size,
    offset,
    savePath,
    id
  );
  renderer.render();
});
