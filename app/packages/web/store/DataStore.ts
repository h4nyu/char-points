import { observable } from "mobx";
import { CharImage } from "@charpoints/core";
import { RootStore } from "."
import { RootApi } from "@charpoints/api";

type State = {
  charImages: CharImage[];
};
export const DataStore = (args: {api: RootApi}) => {
  const {api} = args
  const state: State = observable({
    charImages: [],
  });
  const fetchCharImages = async ():Promise<void> => {
    const rows = await api.charImage.filter({})
    if(rows instanceof Error) {
      return
    }
    state.charImages = rows
  };
  return {
    state,
  };
};
