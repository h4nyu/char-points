import { CharImageApi } from "./charImage";
import { Box } from "@charpoints/core/box";
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
  detectionUrl: () => Promise<string | Error>;
  charImage: CharImageApi;
  point: PointApi;
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

  const charImage = CharImageApi({ http, prefix: `${prefix}/char-image` });
  const point = PointApi(http, `${prefix}/point`);

  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };
  return {
    setUrl,
    detectionUrl,
    point,
    charImage,
  };
};

export type DetectPayload = {
  data: string;
};
export type DetectionApi = {
  setUrl: (url: string) => void;
  detect: (
    payload: DetectPayload
  ) => Promise<
    | {
        boxes: Box[];
        scores: number[];
        imageData: string;
      }
    | Error
  >;
};

export const DetectionApi = (): DetectionApi => {
  const http = axios.create();
  const setUrl = (url: string) => {
    http.defaults.baseURL = url;
  };
  const detect = async (payload: DetectPayload) => {
    try {
      const res = await http.post("/api/upload-image", payload);
      const { boxes, scores, image } = res.data;
      return {
        boxes: boxes.map((b) => {
          console.log(b);
          return {
            ...Box(),
            x0: b[0],
            y0: b[1],
            x1: b[2],
            y1: b[3],
          };
        }),
        scores,
        imageData: image,
      };
    } catch (err) {
      return toError(err);
    }
  };

  return {
    setUrl,
    detect,
  };
};
