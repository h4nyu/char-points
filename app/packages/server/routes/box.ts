import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FilterPayload,
  PredictPayload,
  AnnotatePayload,
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
    app.post<{ Body: AnnotatePayload }>("/annotate", {}, async (req, reply) => {
      const res = await srv.annotate(req.body);
      reply.send(res);
    });
    app.post<{ Body: PredictPayload }>("/predict", {}, async (req, reply) => {
      const res = await srv.predict(req.body);
      reply.send(res);
    });
    done();
  };
};
