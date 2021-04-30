import { Sql } from "postgres";
import { Store, Lock } from "@charpoints/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  CropPayload
} from "@charpoints/core/transform";

export const Routes = (args: {
  store: Store;
}): FastifyPlugin<{ prefix: string }> => {
  const { store } = args;
  const srv = Service({ store });
  return function (app, opts, done) {
    app.post<{ Body: CropPayload }>("/crop", {}, async (req, reply) => {
      const res = await srv.crop(req.body);
      reply.send(res);
    });
    done();
  };
};
export default Routes
