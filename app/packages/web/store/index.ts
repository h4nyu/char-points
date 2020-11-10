import { DataStore } from "./DataStore";
import { CharImageStore } from "./CharImageStore";
import { RootApi } from "@charpoints/api";

export const RootStore = () => {
  const api = RootApi();
  const dataStore = DataStore({ api });
  const charImageStore = CharImageStore({ api, dataStore });
  const init = async () => {
    await dataStore.init();
  };
  return {
    dataStore,
    charImageStore,
    init,
  };
};

export default RootStore();
