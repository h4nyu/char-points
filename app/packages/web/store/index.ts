import { DataStore } from "./data";
import { CharImageStore } from "./charImage";
import { RootApi } from "@charpoints/api";
import { Map } from "immutable"
import { CharImage } from "@charpoints/core/charImage";
export type CharImages = Map<string, CharImage>

export type RootStore = {
  data: DataStore;
  charImage: CharImageStore;
  api: RootApi;
  init: () => Promise<void>;
};
export const RootStore = (): RootStore => {
  const api = RootApi();
  const data = DataStore({ api });
  const charImage = CharImageStore({ api, data });
  const init = async () => {
    await data.init();
  };
  return {
    api,
    data,
    charImage,
    init,
  };
};

export default RootStore();
