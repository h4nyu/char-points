import { DataStore } from "./DataStore";
import { CharImageStore } from "./charImage"

export const Store = () => {
  const dataStore = DataStore();
  const charImage = CharImageStore()
  return {
    dataStore,
  };
};

export default RootStore();
