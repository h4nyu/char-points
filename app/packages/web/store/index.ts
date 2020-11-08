import { DataStore } from "./DataStore";
import {RootApi} from "@charpoints/api";

export const RootStore = () => {
  const api = RootApi()
  const dataStore = DataStore({api});
  return {
    dataStore,
  };
};

export default RootStore();
