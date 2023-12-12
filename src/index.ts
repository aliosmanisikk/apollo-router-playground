import { runA } from './subgraph-a';
import { runB } from './subgraph-b';
import { runC } from './subgraph-c';

(async () => {
  const serverA = await runA();
  const serverB = await runB();
  const serverC = await runC();

  const gracefulShutdown = async () => {
    await serverA.stop();
    await serverB.stop();
    await serverC.stop();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
})();
