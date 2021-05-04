import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FilterPayload,
  ReplacePayload,
} from "@charpoints/core/box";

export const Schema = {
  type: 'object',
  required: ['x0', 'y0', "x1", "y1"],
  properties: {
    x0: { type: 'number' },
    y0: { type: 'number' },
    y1: { type: 'number' },
    x1: { type: 'number' },
    label: { type: 'text', },
  }
}

export const Routes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: FilterPayload }>(
      "/filter", 
      {}, 
      async (req, reply) => {
        const res = await srv.filter(req.body);
        reply.send(res);
      }
    );
    app.post<{ Body: ReplacePayload }>("/replace", {}, async (req, reply) => {
      const res = await srv.replace(req.body);
      reply.send(res);
    });
    done();
  };
};
