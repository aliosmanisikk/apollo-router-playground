import { runA } from "./subgraph-a";
import { runB } from "./subgraph-b";
import { runC } from "./subgraph-c";

(async () => {
  await runA();
  await runB();
  await runC();
})();
