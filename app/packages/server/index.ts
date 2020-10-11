import fastify from "fastify";
import { CreatePayload, createUser } from "./domain";
import { Lock } from "./lock";
import database from "./database";
const lock = Lock({ dir: "/tmp" });
const server = fastify();

server.post<{
  Body: CreatePayload;
}>("/user", {}, async (request) => {
  const payload = request.body;
  return await createUser(lock, database, payload);
});

server.listen(80, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
