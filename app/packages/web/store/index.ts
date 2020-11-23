import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { LoadingStore } from "./loading";
import { ToastStore } from "./toast";
import { RootApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Map } from "immutable";
import { EditChartImage } from "./editChartImage";
import { CharImage, Point } from "@charpoints/core/charImage";
import { createHashHistory } from "history";
export { CharImage, Point } from "@charpoints/core/charImage";
import { configure } from "mobx";
configure({
  enforceActions: "never",
});
export type CharImages = Map<string, CharImage>;
export enum Level {
  Info,
  Success,
  Warning,
  Error,
}
export type History = {
  push: (name: string) => void;
};

export type RootStore = {
  data: DataStore;
  loading: LoadingStore;
  toast: ToastStore;
  charImage: CharImageStore;
  history: History;
  editCharImage: EditChartImage;
  api: RootApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const loading = LoadingStore();
  const toast = ToastStore();
  const error = ErrorStore({ toast });
  const history = createHashHistory();

  const data = DataStore({ api, loading, error });
  const editCharImage = EditChartImage({ data, history });
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
    history,
    editCharImage,
  };
};

export default RootStore();
