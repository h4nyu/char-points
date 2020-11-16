import fastify, { FastifyPlugin } from "fastify";
import { Lock, CharImageStore } from "@charpoints/core";
import path from "path";
import { CharImageRoutes } from "./charImage";
import fastifyStatic from "fastify-static";

export type Store = {
  charImage: CharImageStore;
};

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify();
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.register(fastifyStatic, {
    root: "/srv/packages/web/dist",
  });
  app.register(CharImageRoutes({ store, lock }), {
    prefix: `${prefix}/char-image`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
