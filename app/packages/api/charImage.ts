import { AxiosInstance } from "axios";
import { toError } from ".";
import { CharImage } from "@charpoints/core";
import { FilterPayload, CreatePayload } from "@charpoints/core/charImage";

export const CharImageApi = (arg: { http: AxiosInstance; prefix: string }) => {
  const { http, prefix } = arg;
  const to = (res: any): CharImage => {
    return {
      ...res,
      data: Buffer.from(res.data),
    };
  };

  const create = async (payload: { data: Buffer }): Promise<string | Error> => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const filter = async (payload: FilterPayload): Promise<CharImage[] | Error> => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data.map(to);
    } catch (err) {
      return toError(err);
    }
  };

  return {
    create,
    filter,
  };
};
