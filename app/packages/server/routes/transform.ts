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
    app.post<{ Body: CropPayload }>(
      "/crop", 
      {
        schema: {
          body: {
            type: 'object',
            properties: {
              imageData: { type: 'string' },
              box: { 
                type: 'object',
                properties: {
                  x0: { type: 'number' },
                  y0: { type: 'number' },
                  x1: { type: 'number' },
                  y1: { type: 'number' },
                }
              },
            },
          },
          response: {
            200: {
              description: 'Successful response',
              type: 'string',
            }
          },
        },
      }, 
      async (req, reply) => {
        const res = await srv.crop(req.body);
        reply.send(res);
      }
    );
    done();
  };
};
export default Routes
