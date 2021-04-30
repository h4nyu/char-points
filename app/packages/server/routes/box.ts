import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FilterPayload,
  ReplacePayload,
} from "@charpoints/core/box";

export const Routes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: FilterPayload }>("/filter", {}, async (req, reply) => {
      const res = await srv.filter(req.body);
      reply.send(res);
    });
    app.post<{ Body: ReplacePayload }>("/replace", {}, async (req, reply) => {
      const res = await srv.replace(req.body);
      reply.send(res);
    });
    done();
  };
};
