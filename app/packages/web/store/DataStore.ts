import { observable } from "mobx";
import { CharImage } from "@charpoints/core";
import { RootStore } from ".";
import { RootApi } from "@charpoints/api";

type State = {
  charImages: CharImage[];
};
export type DataStore = {
  state:State
  fetchCharImages: () => Promise<void>;
  init: () => Promise<void>
}
export const DataStore = (args: { api: RootApi }):DataStore => {
  const { api } = args;
  const state: State = observable({
    charImages: [],
  });
  const fetchCharImages = async (): Promise<void> => {
    const rows = await api.charImage.filter({});
    if (rows instanceof Error) {
      return;
    }
    state.charImages = rows;
  };

  const deleteChartImage = async (id:string): Promise<void> => {
    await api.charImage.delete({id})
  }

  const init = async () => {
    await fetchCharImages()
  }
  return {
    state,
    fetchCharImages,
    init,
  };
};
