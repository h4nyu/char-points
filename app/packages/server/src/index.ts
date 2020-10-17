import fastify from "fastify";
import cluster from "cluster";
import os from "os";
import { Lock } from "./lock";
import database from "./database";
import { CreatePayload, createUser } from "x-core/user";
import fastifyStatic from "fastify-static"

const lock = Lock({ dir: "/tmp" });
const server = fastify({ logger: true });

server.post<{
  Body: CreatePayload;
}>("/user", {}, async (request) => {
  const payload = request.body;
  return await createUser(lock, database, payload);
});

server.register(fastifyStatic, {
  root: '/srv/packages/web/dist',
})

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
