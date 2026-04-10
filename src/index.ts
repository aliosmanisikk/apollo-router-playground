import { runA } from "./subgraph-a";
import { runC } from "./subgraph-c";

let isShuttingDown = false;
const noopInterval = setInterval(() => {}, 1000);

(async () => {
  const serverA = await runA();
  const serverC = await runC();

  const gracefulShutdown = async () => {
    console.log("Shutting down servers gracefully...");
    if (isShuttingDown) return;
    isShuttingDown = true;

    await serverA.stop();
    await serverC.stop();
    console.log("All servers stopped gracefully.");

    clearInterval(noopInterval);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
})();
