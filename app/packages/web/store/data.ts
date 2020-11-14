import { observable } from "mobx";
import { CharImages } from ".";
import { Map } from "immutable";
import { RootApi } from "@charpoints/api";

type State = {
  charImages: CharImages;
};
export type DataStore = {
  state: State;
  fetchCharImages: (payload: { ids?: string[] }) => Promise<void>;
  deleteChartImage: (id: string) => Promise<void>;
  init: () => Promise<void>;
};
export const DataStore = (args: { api: RootApi }): DataStore => {
  const { api } = args;
  const state: State = observable({
    charImages: Map() as CharImages,
  });
  const fetchCharImages = async (payload: {
    ids?: string[];
  }): Promise<void> => {
    const rows = await api.charImage.filter(payload);
    if (rows instanceof Error) {
      return;
    }
    const reqs = rows.map((x) => api.charImage.find({ id: x.id }));
    for (const row of await Promise.all(reqs)) {
      if (row instanceof Error) {
        continue;
      }
      state.charImages = state.charImages.set(row.id, row);
    }
  };

  const deleteChartImage = async (id: string): Promise<void> => {
    const err = await api.charImage.delete({ id });
    if (err instanceof Error) {
      return;
    }
    state.charImages = state.charImages.delete(id);
  };

  const init = async () => {
    await fetchCharImages({});
  };
  return {
    state,
    fetchCharImages,
    deleteChartImage,
    init,
  };
};
