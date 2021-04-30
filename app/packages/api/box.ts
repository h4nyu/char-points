import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  ReplacePayload,
  Service,
  Box,
} from "@charpoints/core/box";

export type BoxApi = Service;

export const BoxApi = (http: AxiosInstance, prefix: string): Service => {
  const to = (res): Box => {
    return Box(res)
  };
  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data.map(to);
    } catch (err) {
      return toError(err);
    }
  };
  const replace = async (payload: ReplacePayload) => {
    try {
      const res = await http.post(`${prefix}/replace`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    replace,
  };
};
