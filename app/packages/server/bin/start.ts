import { App } from "../routes";
import { Store } from "../store";
import { Lock } from "@oniku/lockfile";
import cluster from "cluster";
import os from "os";

const store = Store({
  url: process.env.DATABASE_URL || "",
});
const lock = Lock({ dir: "/tmp" });
export const app = App({ store, lock });

if (cluster.isMaster && process.env.NODE_ENV !== "development") {
  console.log(`Master ${process.pid} is running`);
  for (const _ of os.cpus()) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.listen(80, "0.0.0.0", (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Slave ${process.pid} Server listening at ${address}`);
  });
}
