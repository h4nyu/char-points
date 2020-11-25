import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  Service,
} from "@charpoints/core/point";

export type Api = Service;

export const Api = (http: AxiosInstance, prefix: string): Service => {
  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
  };
};

