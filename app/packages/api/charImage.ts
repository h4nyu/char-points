import { AxiosInstance } from "axios";
import { toError } from ".";
import { CharImage } from "@charpoints/core";
import { FilterPayload, CreatePayload, DeletePayload } from "@charpoints/core/charImage";

export type CharImageApi = {
  filter: (payload: FilterPayload) => Promise<CharImage[] | Error>;
  create: (payload: CreatePayload) => Promise<string | Error>;
  delete: (payload: DeletePayload) => Promise<string | Error>
};

export const CharImageApi = (arg: { http: AxiosInstance; prefix: string }):CharImageApi => {
  const { http, prefix } = arg;

  const create = async (payload: CreatePayload): Promise<string | Error> => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const filter = async (
    payload: FilterPayload
  ): Promise<CharImage[] | Error> => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const delete_ = async (payload: DeletePayload): Promise<string | Error> => {
    try {
      const res = await http.post(`${prefix}/delete`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    create,
    filter,
    delete: delete_
  };
};
