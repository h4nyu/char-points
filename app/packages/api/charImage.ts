import { AxiosInstance } from "axios";

import { FilterPayload, CreatePayload } from "@charpoints/core/charImage";

export const CharImageApi = (arg: { http: AxiosInstance; prefix: string }) => {
  const { http, prefix } = arg;

  const create = async (payload: CreatePayload): Promise<string | Error> => {
    return "string";
  };

  const filter = async (payload: FilterPayload): Promise<string | Error> => {
    const res = await http
      .post(`${prefix}/filter`, payload)
      .catch((e) => new Error(e));
    if (res instanceof Error) {
      return res;
    }
    return res.data;
  };

  return {
    create,
    filter,
  };
};
