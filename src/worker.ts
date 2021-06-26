import { Renderer } from "./renderer/renderer";

process.on("message", (data) => {
  console.log(`starting worker: ${data.id}`);
  const { id, sceneData, size, offset, fullSize } = data;
  const savePath = `./out/${sceneData.name}/p${id}/`;
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
