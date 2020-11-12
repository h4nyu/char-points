import { observable } from "mobx";
import { CharImage } from "@charpoints/core";
import { RootApi } from "@charpoints/api";

type State = {
  charImages: CharImage[];
};
export type DataStore = {
  state: State;
  fetchCharImages: () => Promise<void>;
  deleteChartImage: (id: string) => Promise<void>;
  init: () => Promise<void>;
};
export const DataStore = (args: { api: RootApi }): DataStore => {
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

  const deleteChartImage = async (id: string): Promise<void> => {
    const err = await api.charImage.delete({ id });
    if (err instanceof Error) {
      return;
    }
    state.charImages = state.charImages.filter((x) => x.id !== id);
  };

  const init = async () => {
    await fetchCharImages();
  };
  return {
    state,
    fetchCharImages,
    deleteChartImage,
    init,
  };
};
