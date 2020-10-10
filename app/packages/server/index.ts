import fastify from "fastify";
const server = fastify();

server.get("/ping", () => {
  return "pong\n";
});

server.listen(80, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
