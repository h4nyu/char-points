import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi, DetectionApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Map, List } from "immutable";
import { EditChartImage } from "./editChartImage";
import { createHashHistory } from "history";
import { CharImage } from "@charpoints/core/charImage";
export { CharImage } from "@charpoints/core/charImage";
export { Point } from "@charpoints/core/point";
import { Point } from "@charpoints/core/point";
export { Box } from "@charpoints/core/box";
import { Box } from "@charpoints/core/box";
import { configure } from "mobx";
configure({
  enforceActions: "never",
});
export type CharImages = Map<string, CharImage>;
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
  BR = "BR"
};

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  toast: ToastStore;
  charImage: CharImageStore;
  history: History;
  editCharImage: EditChartImage;
  api: RootApi;
  detectionApi: DetectionApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const detectionApi = DetectionApi()
  const loading = LoadingStore();
  const toast = ToastStore();
  const error = ErrorStore({ toast });
  const history = createHashHistory();

  const data = DataStore({ api, loading, error });
  const editCharImage = EditChartImage({
    data,
    history,
    api,
    detectionApi,
    loading,
    toast,
    error,
  });
  const charImage = CharImageStore({
    api,
    data,
    toast,
    loading,
    error,
  });
  const init = async () => {
    await data.init();
    const url = await api.detectionUrl()
    if(url instanceof Error) { return }
    detectionApi.setUrl(url)
    toast.show("Success", Level.Success);
  };
  return {
    api,
    detectionApi,
    data,
    toast,
    loading,
    charImage,
    init,
    history,
    editCharImage,
  };
};

export default RootStore();
