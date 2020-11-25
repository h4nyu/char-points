import { CharImageApi } from "./charImage";
import { Api as PointApi } from "./point";

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
  charImage: CharImageApi;
  point: PointApi;
};

export const RootApi = (): RootApi => {
  const http = axios.create();
  const prefix = "api/v1";
  const charImage = CharImageApi({ http, prefix: `${prefix}/char-image` });
  const point = PointApi(http, `${prefix}/point`)
  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };
  return {
    setUrl,
    point,
    charImage,
  };
};
