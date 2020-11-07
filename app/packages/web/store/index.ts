import { DataStore } from "./DataStore";
// import { CharImageStore } from "./charImage";

export const RootStore = () => {
  const dataStore = DataStore();
  // const charImage = CharImageStore();
  return {
    // charImage,
    dataStore,
  };
};

export default RootStore();
