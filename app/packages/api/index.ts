import { ImageApi } from "./image";
import { Box } from "@charpoints/core/box";
import { BoxApi } from "@charpoints/api/box";
import { Api as PointApi } from "./point";
import TransformApi from "./transform";

import axios from "axios";

export function toError(err: any): Error {
  const message = err.response?.data?.message;
  if (message) {
    return new Error(message);
  } else {
    return new Error(err.message);
  }
}

export type RootApi = {
  setUrl: (url: string) => void;
  detectionUrl: () => Promise<string | Error>;
  image: ImageApi;
  point: PointApi;
  box: BoxApi;
  transform: TransformApi;
};

export const RootApi = (): RootApi => {
  const http = axios.create();
  const prefix = "api/v1";
  const detectionUrl = async () => {
    try {
      const res = await http.get(`${prefix}/detection-api`);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const image = ImageApi({ http, prefix: `${prefix}/image` });
  const point = PointApi(http, `${prefix}/point`);
  const box = BoxApi(http, `${prefix}/box`);
  const transform = TransformApi(http, `${prefix}/transform`);

  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };
  return {
    setUrl,
    detectionUrl,
    point,
    box,
    image,
    transform,
  };
};
export default RootApi
