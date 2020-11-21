import { observable } from "mobx";
import { ToastStore } from "./toast";
import { ErrorStore } from "./error";
import { LoadingStore } from "./loading";
import { Set } from "immutable";
import { RootApi } from "@charpoints/api";
import { readAsText } from "../utils";
import { DataStore } from "./data";
import { fromLabelMe } from "@charpoints/core/charImage";
import { Level } from ".";

export type State = {
  selectedIds: Set<string>;
};
export const State = () => {
  return {
    selectedIds: Set(),
  };
};

export type CharImageStore = {
  state: State;
  select: (id: string) => void;
  selectAll: () => void;
  unSelectAll: () => void;
  uploadFiles: (files: File[]) => void;
  delete: (id: string) => Promise<void>;
};
export const CharImageStore = (root: {
  api: RootApi;
  data: DataStore;
  toast: ToastStore;
  loading: LoadingStore;
  error: ErrorStore;
}) => {
  const { api, data, toast, loading, error } = root;
  const state = observable(State());

  const uploadFiles = async (files: File[]) => {
    const ids: string[] = [];
    await loading.auto(async () => {
      for (const f of files) {
        const text = await readAsText(f);
        if (text instanceof Error) {
          continue;
        }
        const charImage = fromLabelMe(JSON.parse(text))
        const { data, points } = charImage
        if(data === undefined){ continue; }
        const id = await api.charImage.create({data, points});
        if (id instanceof Error) {
          error.notify(id);
          continue;
        }
        await root.data.fetchCharImages({ ids: [id] });
      }
    });
    toast.show("Success", Level.Success);
  };

  const select = (id: string) => {
    let { selectedIds } = state;
    if (selectedIds.has(id)) {
      selectedIds = selectedIds.delete(id);
    } else {
      selectedIds = selectedIds.add(id);
    }
    state.selectedIds = selectedIds;
  };
  const selectAll = () => {
    const { charImages } = data.state;
    state.selectedIds = charImages.keySeq().toSet();
  };

  const unSelectAll = () => {
    state.selectedIds = Set();
  };

  const delete_ = async () => {
    await loading.auto(async () => {
      let { selectedIds } = state;
      for (const id of state.selectedIds) {
        await data.deleteChartImage(id);
        selectedIds = selectedIds.delete(id);
      }
      state.selectedIds = selectedIds;
    });
    toast.show("Success", Level.Success);
  };

  return {
    state,
    select,
    selectAll,
    unSelectAll,
    uploadFiles,
    delete: delete_,
  };
};
