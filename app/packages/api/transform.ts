import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  CropPayload,
  Service,
} from "@charpoints/core/transform";

export type Api = Service;

export const Api = (http: AxiosInstance, prefix: string): Service => {
  const crop = async (payload: CropPayload) => {
    try {
      const res = await http.post(`${prefix}/crop`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  return {
    crop
  };
};
export default Api
