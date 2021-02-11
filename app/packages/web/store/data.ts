import { observable, computed } from "mobx";
import { Images, Points } from ".";
import { Map, List } from "immutable";
import { ErrorStore } from "./error";
import { v4 as uuid } from "uuid";
import { RootApi } from "@charpoints/api";
import { LoadingStore } from "./loading";
import {
  State as ImageState,
  Image,
  FilterPayload,
} from "@charpoints/core/image";
import { saveAs } from 'file-saver';
import { readAsBase64, b64toBlob } from "../utils";
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp";
import { parseISO } from "date-fns";

type State = {
  images: Images;
  cursor: number;
  limit: number;
  tag: ImageState;
  keyword: string;
  sortColumn: string;
  asc:boolean
};

export type DataStore = {
  state: State;
  updateFilter: (payload: {
    tag?: ImageState;
  }) => void;
  next: () => undefined | string;
  prev: () => undefined | string;
  setCursor: (id: string) => void;
  fetchImages: () => Promise<void>;
  fetchImage: (id: string) => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteImage: (id: string) => void;
  download: (id: string) => Promise<void>;
  setKeyword:(value:string) => void;
  setSort: (column: string, asc:boolean ) => void
  init: () => Promise<void>;
};
const State = () => {
  return {
    cursor: 0,
    images: List(),
    limit: 100,
    tag: ImageState.Todo,
    keyword: "",
    sortColumn: "Id",
    asc: false,
  };
};
export const DataStore = (args: {
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
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
    await loading(async () => {
      const rows = await api.image.filter({
        state: state.tag
      });
      if (rows instanceof Error) {
        return;
      }
      const lowerKeyword = state.keyword.toLowerCase();
      state.images = List(rows).filter( x => {
        return `${x.id}`.toLowerCase().includes(lowerKeyword)
      });
    })
  };
  const updateFilter = (payload: {
    tag?: ImageState;
  }) => {
    const { tag } = payload;
    if (tag !== undefined) {
      state.tag = tag;
    }
  };
  const init = async () => {
    await loading(async () => {
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
    await loading(async () => {
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
        const id = await api.image.create({ data, name:f.name });
        if (id instanceof Error) {
          error.notify(id);
          continue;
        }
        await fetchImage(id);
      }
    });
  };
  const setKeyword = (value:string) => {
    state.keyword = value;
  }
  const setSort = (column:string, asc:boolean) => {
    state.sortColumn = column;
    state.asc = asc;
    state.images = state.images.sortBy(x => {
      if(column === "Id"){
        return x.id
      }else if(column === "Score"){
        return x.loss || 0.0
      }else if(column === "Box"){
        return x.boxCount
      }else if(column === "Point"){
        return x.pointCount
      }else if(column === "Create"){
        return x.createdAt
      }else if(column === "Update"){
        return x.updatedAt
      }
    })
    if(asc) {
      state.images = state.images.reverse()
    }
  }

  const download = async (id: string) => {
    const img = await api.image.find({ id });
    if (img instanceof Error) {
      error.notify(img)
      return
    }
    if (img.data === undefined) {
      return;
    }
    const blob = b64toBlob(img.data);
    if (blob instanceof Error) {
      error.notify(blob)
      return;
    }
    saveAs(blob, img.name || `${img.id}.jpg`);
  }
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
    setKeyword,
    download,
    setSort,
    init,
  };
};
