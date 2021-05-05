import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FilterPayload,
  FindPayload,
  DeletePayload,
  UpdatePayload,
  CreatePayload,
} from "@charpoints/core/image";

export const Schema = {
  type: 'object',
  required: ['id', 'data', "name", "createdAt"],
  properties: {
    id: { type: 'string' },
    data: { type: 'string' },
    name: { type: 'string' },
    createdAt: { type: 'string', format: "date-time" },
  }
}

export const Routes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: CreatePayload }>(
      "/create", 
      {
        schema: {
          body: {
            type: 'object',
            required: ['data', "name"],
            properties: {
              id: { type: 'string' },
              data: { type: 'string' },
              name: { type: 'string' },
            }
          },
          response: {
            200: {
              description: 'Successful response',
              ...Schema
            }
          },
        },
      }, 
      async (req, reply) => {
        const res = await srv.create(req.body);
        reply.send(res);
      }
    );
    app.post<{ Body: UpdatePayload }>("/update", {}, async (req, reply) => {
      const res = await srv.update(req.body);
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
export default Routes
