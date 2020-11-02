import { App } from "../routes";

const app = App();
app.listen(80, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Slave ${process.pid} Server listening at ${address}`);
});
