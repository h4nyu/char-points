import { Sql } from "postgres";
import { Store } from ".";
import { CharImage, Lock, CharImageStore } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import { Service, FilterPayload } from "@charpoints/core/charImage";

export const CharImageRoutes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{
      Body: {
        data: string;
      };
    }>("/create", {}, async (req, reply) => {
      const res = await srv.create({
        data: Buffer.from(req.body.data, "base64"),
      });
      reply.send(res);
    });
    app.post<{ Body: FilterPayload }>("/filter", {}, async (req, reply) => {
      const res = await srv.filter(req.body);
      reply.send(res);
    });
    done();
  };
};
