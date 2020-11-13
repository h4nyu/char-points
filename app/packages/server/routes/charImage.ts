import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FilterPayload,
  FindPayload,
  DeletePayload,
  CreatePayload,
} from "@charpoints/core/charImage";

export const CharImageRoutes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: CreatePayload }>("/create", {}, async (req, reply) => {
      const res = await srv.create(req.body);
      reply.send(res);
    });
    app.post<{ Body: FilterPayload }>("/filter", {}, async (req, reply) => {
      const res = await srv.filter(req.body);
      reply.send(res);
    });
    app.post<{ Body: FindPayload }>("/find", {}, async (req, reply) => {
      const res = await srv.find(req.body);
      reply.send(res);
    });
    app.post<{ Body: DeletePayload }>("/delete", {}, async (req, reply) => {
      const res = await srv.delete(req.body);
      reply.send(res);
    });
    done();
  };
};
