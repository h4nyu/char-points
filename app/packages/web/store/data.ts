import { observable } from "mobx";
import { CharImages, Points } from ".";
import { Map, List } from "immutable";
import { ErrorStore } from "./error";
import { RootApi } from "@charpoints/api";
import { LoadingStore } from "./loading";
import { State as ImageState, CharImage, FilterPayload } from "@charpoints/core/charImage"
import { MemoryRouter } from "react-router";
import { take, flow, sortBy, map } from "lodash/fp"
import { parseISO } from 'date-fns'
import dayjs from "dayjs";

type State = {
  images: CharImages;
  cursor: number;
  limit: number;
  tag: ImageState;
  isBox: boolean;
  isPoint: boolean;
};

export type DataStore = {
  state: State;
  updateFilter: (payload: { isBox?: boolean, isPoint?: boolean, tag?: ImageState, }) => void;
  next: () => undefined|string;
  prev: () => undefined|string;
  setCursor: (id: string) => void;
  fetchImages: () => Promise<void>;
  fetchImage: (id:string) => Promise<void>;
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

  const fetchImage = async (id:string) => {
    const row = await api.charImage.find({id});
    if (row instanceof Error) {
      error.notify(row);
      return
    }
    const index = state.images.findIndex(x => x.id === id)
    if(index === -1){
      state.images = state.images.push(row);
    }
    else{
      state.images = state.images.set(index, row);
    }
    state.images = state.images.sortBy( x => - parseISO(x.createdAt))
  }

  const fetchImages = async (): Promise<void> => {
    const rows = await api.charImage.filter({
      hasPoint:state.isPoint,
      hasBox:state.isBox,
      state:state.tag,
    });
    if (rows instanceof Error) {
      return;
    }
    state.images = List()
    await loading.auto(async () => {
      for (const id of rows.map(x => x.id)) {
        await fetchImage(id)
      }
    });
  };
  const updateFilter = (payload:{
    isBox?: boolean,
    isPoint?: boolean,
    tag?: ImageState,
  }) => {
    const {isBox, isPoint, tag} = payload
    if(isBox !== undefined){
      state.isBox = isBox;
    }
    if(isPoint !== undefined){
      state.isPoint = isPoint
    }
    if(tag !== undefined){
      state.tag = tag
    }
  };
  const init = async () => {
    await loading.auto(async () => {
      await fetchImages();
    });
  };
  const next = () => {
    const img = state.images.get(state.cursor + 1)
    if(img) {
      state.cursor = state.cursor + 1;
    }
    return img?.id;
  }

  const prev = () => {
    const img = state.images.get(state.cursor - 1)
    if(img) {
      state.cursor = state.cursor - 1;
    }
    return img?.id;
  }
  const setCursor = (id:string) => {
    state.cursor = state.images.findIndex(x => x.id === id)
  }

  return {
    state,
    next,
    prev,
    setCursor,
    updateFilter,
    fetchImages,
    fetchImage,
    init,
  };
};
