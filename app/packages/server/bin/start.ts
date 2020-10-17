import fastify from "fastify";
import cluster from "cluster";
import os from "os";
import fastifyStatic from "fastify-static";

const server = fastify({ logger: true });

server.register(fastifyStatic, {
  root: "/srv/packages/web/dist",
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  server.listen(80, "0.0.0.0", (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Slave ${process.pid} Server listening at ${address}`);
  });
}
