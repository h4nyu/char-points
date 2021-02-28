import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  AnnotatePayload,
  PredictPayload,
  Service,
  Point,
} from "@charpoints/core/point";

export type Api = Service;

export const Api = (http: AxiosInstance, prefix: string): Service => {
  const to = (res) => {
    return {
      ...Point(),
      ...res,
    };
  };
  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data.map(to);
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
