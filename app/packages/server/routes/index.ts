import fastify, { FastifyPlugin } from "fastify";
import { Lock, Store } from "@charpoints/core";
import path from "path";
import { CharImageRoutes } from "./charImage";
import { Routes as PointRoutes } from "./point";
import fastifyStatic from "fastify-static";

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({ bodyLimit: 10048576 });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.get(`${prefix}/detection-api`, {}, async (req, rep) => {
    rep.send(process.env.DETECTION_API);
  });
  app.register(fastifyStatic, {
    root: "/srv/packages/web/dist",
  });
  app.register(CharImageRoutes({ store, lock }), {
    prefix: `${prefix}/char-image`,
  });
  app.register(PointRoutes({ store, lock }), {
    prefix: `${prefix}/point`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
