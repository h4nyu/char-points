import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  AnnotatePayload,
  PredictPayload,
  Service,
} from "@charpoints/core/box";

export type BoxApi = Service;

export const BoxApi = (http: AxiosInstance, prefix: string): Service => {
  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  const annotate = async (payload: AnnotatePayload) => {
    try {
      const res = await http.post(`${prefix}/annotate`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const predict = async (payload: PredictPayload) => {
    try {
      const res = await http.post(`${prefix}/predict`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    filter,
    annotate,
    predict,
  };
};
