import { App } from "../routes";
import { Store } from "../store";
import { Lock } from "@oniku/lockfile";

const store = Store({
  url: process.env.DATABASE_URL || "",
});
const lock = Lock({ dir: "/tmp" });
const app = App({ store, lock });
app.listen(80, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Slave ${process.pid} Server listening at ${address}`);
});
