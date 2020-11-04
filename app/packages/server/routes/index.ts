import fastify, { FastifyPlugin } from "fastify";
import { Lock, CharImageStore } from "@charpoints/core";
import path from "path";

type Store = {};

export const App = (args: { store: Store; lock: Lock }) => {
  const app = fastify({ logger: true });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
