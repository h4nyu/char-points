import { observable } from "mobx";
import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@charpoints/api";
import { Map } from "immutable";
import { CharImage } from "@charpoints/core/charImage";
export { CharImage } from "@charpoints/core/charImage";
export type CharImages = Map<string, CharImage>;
export enum Level {
  Info,
  Success,
  Warning,
  Error,
}

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  toast: ToastStore;
  charImage: CharImageStore;
  api: RootApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const loading = LoadingStore();
  const toast = ToastStore();

  const data = DataStore({ api, loading, toast });
  const charImage = CharImageStore({ api, data });
  const init = async () => {
    await data.init();
  };
  return {
    api,
    data,
    toast,
    loading,
    charImage,
    init,
  };
};

export default RootStore();
