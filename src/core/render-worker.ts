const renderWorkerCtx: Worker = self as any;

renderWorkerCtx.addEventListener("message", (event) => {
  renderWorkerCtx.postMessage({ data: event.data, sendBy: "renderWorker" });
});
