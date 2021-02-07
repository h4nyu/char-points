import fastify, { FastifyPlugin } from "fastify";
import { Lock, Store } from "@charpoints/core";
import path from "path";
import { ImageRoutes } from "./image";
import { Routes as PointRoutes } from "./point";
import { Routes as BoxRoutes } from "./box";
import fastifyStatic from "fastify-static";
import fastifyCors from "fastify-cors";

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({
    bodyLimit: 10048576,
    logger: true,
  });
  app.register(fastifyCors);
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.get(`${prefix}/detection-api`, {}, async (req, rep) => {
    rep.send(process.env.DETECTION_API);
  });
  app.register(fastifyStatic, {
    root: "/srv/packages/web/dist",
  });
  app.register(ImageRoutes({ store, lock }), {
    prefix: `${prefix}/image`,
  });
  app.register(PointRoutes({ store, lock }), {
    prefix: `${prefix}/point`,
  });
  app.register(BoxRoutes({ store, lock }), {
    prefix: `${prefix}/box`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
