import { observable } from "mobx";
import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { LoadingStore } from "./loading";
import { RootApi } from "@charpoints/api";
import { Map } from "immutable";
import { CharImage } from "@charpoints/core/charImage";
export { CharImage } from "@charpoints/core/charImage";
export type CharImages = Map<string, CharImage>;
export enum Level {
  Info,
  Warning,
  Error,
}

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  charImage: CharImageStore;
  api: RootApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const loading = LoadingStore();

  const data = DataStore({ api, loading });
  const charImage = CharImageStore({ api, data });
  const init = async () => {
    await data.init();
  };
  return {
    api,
    data,
    loading,
    charImage,
    init,
  };
};

export default RootStore();
