import fastify, { FastifyPlugin } from "fastify";
import { Lock, CharImageStore } from "@charpoints/core";
import path from "path";
import { CharImageRoutes } from "./charImage";

export type Store = {
  charImage: CharImageStore;
};

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({ logger: true });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.register(CharImageRoutes({ store, lock }), {
    prefix: `${prefix}/char-image`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
