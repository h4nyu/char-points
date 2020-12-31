import { observable, computed } from "mobx";
import { Images, Points } from ".";
import { Map, List } from "immutable";
import { ErrorStore } from "./error";
import { RootApi } from "@charpoints/api";
import { LoadingStore } from "./loading";
import {
  State as ImageState,
  Image,
  FilterPayload,
} from "@charpoints/core/image";
import { readAsBase64 } from "../utils";
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";

type State = {
  images: Images;
  cursor: number;
  limit: number;
  tag: ImageState;
  isBox: boolean;
  isPoint: boolean;
};

export type DataStore = {
  state: State;
  updateFilter: (payload: {
    isBox?: boolean;
    isPoint?: boolean;
    tag?: ImageState;
  }) => void;
  next: () => undefined | string;
  prev: () => undefined | string;
  setCursor: (id: string) => void;
  fetchImages: () => Promise<void>;
  fetchImage: (id: string) => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteImage: (id: string) => void;
  init: () => Promise<void>;
};
const State = () => {
  return {
    cursor: 0,
    images: List(),
    limit: 100,
    tag: ImageState.Todo,
    isPoint: false,
    isBox: false,
  };
};
export const DataStore = (args: {
  api: RootApi;
  loading: LoadingStore;
  error: ErrorStore;
}): DataStore => {
  const { api, loading, error } = args;
  const state = observable(State());

  const fetchImage = async (id: string) => {
    const row = await api.image.find({ id });
    if (row instanceof Error) {
      error.notify(row);
      return;
    }
    const index = state.images.findIndex((x) => x.id === id);
    if (index === -1) {
      state.images = state.images.push(row);
    } else {
      state.images = state.images.set(index, row);
    }
  };
  const deleteImage = (id: string) => {
    state.images = state.images.filter((x) => x.id !== id);
  };

  const fetchImages = async (): Promise<void> => {
    const rows = await api.image.filter({});
    if (rows instanceof Error) {
      return;
    }
    state.images = List(rows).filter( x => {
      return x.state === state.tag && (state.isBox ? x.boxCount > 0: x.boxCount === 0) && (state.isPoint ? x.pointCount > 0 : x.pointCount === 0)
    });
  };
  const updateFilter = (payload: {
    isBox?: boolean;
    isPoint?: boolean;
    tag?: ImageState;
  }) => {
    const { isBox, isPoint, tag } = payload;
    if (isBox !== undefined) {
      state.isBox = isBox;
    }
    if (isPoint !== undefined) {
      state.isPoint = isPoint;
    }
    if (tag !== undefined) {
      state.tag = tag;
    }
  };
  const init = async () => {
    await loading.auto(async () => {
      await fetchImages();
    });
  };
  const next = () => {
    const img = state.images.get(state.cursor + 1);
    if (img) {
      state.cursor = state.cursor + 1;
    }
    return img?.id;
  };

  const prev = () => {
    const img = state.images.get(state.cursor - 1);
    if (img) {
      state.cursor = state.cursor - 1;
    }
    return img?.id;
  };
  const setCursor = (id: string) => {
    state.cursor = state.images.findIndex((x) => x.id === id);
  };

  const uploadFiles = async (files: File[]) => {
    const ids: string[] = [];
    await loading.auto(async () => {
      for (const f of files) {
        if (!f.type.includes("image")) {
          error.notify(Error("UnsupportedFormat"));
          continue;
        }
        const data = await readAsBase64(f);
        if (data instanceof Error) {
          error.notify(data);
          continue;
        }
        const id = await api.image.create({ data });
        if (id instanceof Error) {
          error.notify(id);
          continue;
        }
        await fetchImage(id);
      }
    });
  };
  return {
    state,
    next,
    prev,
    setCursor,
    updateFilter,
    fetchImages,
    fetchImage,
    deleteImage,
    uploadFiles,
    init,
  };
};
