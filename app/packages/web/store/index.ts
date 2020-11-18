import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@charpoints/api";
import { ErrorStore } from "./error";
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
  const error = ErrorStore({ toast });

  const data = DataStore({ api, loading, error });
  const charImage = CharImageStore({
    api,
    data,
    toast,
    loading,
    error,
  });
  const init = async () => {
    await data.init();
    toast.show("Success", Level.Success);
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
