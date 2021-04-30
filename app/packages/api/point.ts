import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  ReplacePayload,
  Service,
  Point,
} from "@charpoints/core/point";

export type Api = Service;

export const Api = (http: AxiosInstance, prefix: string): Service => {
  const to = (res) => {
    return Point(res)
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
