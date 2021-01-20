import { DataStore } from "./data";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi, DetectionApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Map, List } from "immutable";
import { Editor } from "./editor";
import { createHashHistory } from "history";
import { Image } from "@charpoints/core/image";
export { Image } from "@charpoints/core/image";
export { Point } from "@charpoints/core/point";
import { Point } from "@charpoints/core/point";
export { Box } from "@charpoints/core/box";
import { Box } from "@charpoints/core/box";
import { configure } from "mobx";
configure({
  enforceActions: "never",
});
export type Images = List<Image>;
export type Points = Map<string, Point>;
export type Boxes = Map<string, Box>;
export enum Level {
  Info,
  Success,
  Warning,
  Error,
}

export type History = {
  push: (name: string) => void;
  goBack: () => void;
};

export enum InputMode {
  Point = "Point",
  Box = "Box",
  TL = "TL",
  TR = "TR",
  BL = "BL",
  BR = "BR",
}

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  toast: ToastStore;
  history: History;
  editor: Editor;
  api: RootApi;
  detectionApi: DetectionApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const detectionApi = DetectionApi();
  const loading = LoadingStore();
  const toast = ToastStore();
  const error = ErrorStore({ toast });
  const history = createHashHistory();

  const data = DataStore({ api, loading:loading.loading, error });
  const editor = Editor({
    history,
    api,
    detectionApi,
    loading:loading.loading,
    toast,
    error,
    onInit: (id) => {
      history.push("/edit");
      data.setCursor(id);
    },
    onSave: async (id) => {
      data.fetchImage(id);
    },
    onDelete: (id) => {
      history.push("/");
      data.deleteImage(id);
    },
  });
  const init = async () => {
    await data.init();
    const url = await api.detectionUrl();
    if (url instanceof Error) {
      return;
    }
    detectionApi.setUrl(url);
    toast.info("Success");
  };
  return {
    api,
    detectionApi,
    data,
    toast,
    loading,
    init,
    history,
    editor,
  };
};

export default RootStore();
