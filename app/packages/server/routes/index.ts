import fastify, { FastifyPlugin } from "fastify";
import {Lock, CharImageStore}  from "@fpalm-auth/core"
import path from "path";
// import { Routes as CharImageRoutes } from "./charImage"

type Store = {
}

export const App = (args: {store:Store, lock:Lock,}) => {
  const app = fastify({ logger: true });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.ready(async () => {
    console.log(app.printRoutes());
    const err = await SystemSrv.setup({
      store,
      lock,
    })
    if (err instanceof Error) {
      console.warn(err);
    }
  });
  return app;
};
