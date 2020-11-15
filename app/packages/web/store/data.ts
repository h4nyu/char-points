import { observable } from "mobx";
import { CharImages } from ".";
import { Map } from "immutable";
import { RootApi } from "@charpoints/api";
import { LoadingStore } from "./loading";
import dayjs from "dayjs";

export type DataStore = {
  state: State;
  fetchCharImages: (payload: { ids?: string[] }) => Promise<void>;
  deleteChartImage: (id: string) => Promise<void>;
  init: () => Promise<void>;
};
type State = {
  charImages: CharImages;
};
const State = (): State => {
  return {
    charImages: Map(),
  };
};
export const DataStore = (args: {
  api: RootApi;
  loading: LoadingStore;
}): DataStore => {
  const { api, loading } = args;
  const state = observable(State());
  const fetchCharImages = async (payload: {
    ids?: string[];
  }): Promise<void> => {
    const rows = await api.charImage.filter(payload);
    let { charImages } = state
    if (rows instanceof Error) {
      return;
    }
    const reqs = rows.map((x) => api.charImage.find({ id: x.id }));
    for (const row of await Promise.all(reqs)) {
      if (row instanceof Error) {
        continue;
      }
      charImages = charImages.set(row.id, row);
    }
    state.charImages = charImages.sortBy(x => - dayjs(x.createdAt))
  };

  const deleteChartImage = async (id: string): Promise<void> => {
    const err = await api.charImage.delete({ id });
    if (err instanceof Error) {
      return;
    }
    state.charImages = state.charImages.delete(id);
  };

  const init = async () => {
    await loading.auto(async () => {
      await fetchCharImages({});
    });
  };
  return {
    state,
    fetchCharImages,
    deleteChartImage,
    init,
  };
};
