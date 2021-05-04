import fastify, { FastifyPlugin } from "fastify";
import { Lock, Store } from "@charpoints/core";
import path from "path";
import ImageRoutes, { Schema as ImageSchema } from "./image";
import { Routes as PointRoutes } from "./point";
import { Routes as BoxRoutes, Schema as BoxSchema, } from "./box";
import TransformRoutes from "./transform";
import packageJson from "@charpoints/server/package.json"
import fastifyStatic from "fastify-static";
import fastifySwagger from "fastify-swagger"
import fastifyCors from "fastify-cors";

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({
    bodyLimit: 10048576,
    logger: true,
  });
  app.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: packageJson.name,
        version: packageJson.version,
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [],
      definitions: {
        Image: ImageSchema,
        Box: BoxSchema,
      },
    },
    exposeRoute: true
  })
  app.register(fastifyCors);
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
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
  app.register(TransformRoutes({ store }), {
    prefix: `${prefix}/transform`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
