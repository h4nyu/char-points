import { observable } from "mobx";
import { RootApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Point, CharImage, History, Level } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { DataStore } from "./data";

export type State = {
  id: string
  points: Point[];
  imageData?: string;
  draggingId: number;
  size: number;
  pos: {
    x: number;
    y: number;
  };
};
export const State = (): State => {
  return {
    id: "",
    points: [],
    imageData: undefined,
    draggingId: -1,
    size: 512,
    pos: {
      x: 0.5,
      y: 0.5,
    },
  };
};

export type EditChartImage = {
  state: State;
  toggleSelect: (pointId?: number) => void;
  addPoint: () => void;
  movePoint: (pos: { x: number; y: number }) => void;
  delPoint: (pointId: number) => void;
  changeSize: (size: number) => void;
  save: () => Promise<void>;
  init: (id: string) => void;
};
export const EditChartImage = (root: { data: DataStore, history: History, api:RootApi, loading:LoadingStore, toast:ToastStore, error:ErrorStore }): EditChartImage => {
  const state = observable(State());
  const { history, data, api, loading, toast, error } = root
  const init = async (id: string) => {
    history.push('/edit')
    const charImage = data.state.charImages.get(id)
    if(charImage===undefined){return }
    state.id = charImage.id
    state.imageData = charImage.data;
    state.points = charImage.points || [];
  };

  const toggleSelect = (pointId?: number) => {
    if (pointId !== undefined && state.draggingId !== pointId) {
      state.draggingId = pointId;
    } else {
      state.draggingId = -1;
    }
  };

  const movePoint = (pos: { x: number; y: number }) => {
    const { points, draggingId } = state;
    state.pos = pos;
    if (draggingId === -1) {
      return;
    }
    const point = points[draggingId];
    points[draggingId] = {
      ...point,
      ...pos,
    };
    state.points = [...points];
  };

  const addPoint = () => {
    if (state.draggingId !== -1) {
      return;
    }
    let { points } = state;
    points = [{ ...Point(), ...state.pos }, ...points];
    state.draggingId = 0;
    state.points = points;
  };

  const delPoint = (pointId: number) => {
    const { points } = state;
    state.points = points.filter((v, k) => k !== pointId);
    toggleSelect(pointId);
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const save = async () => {
    const payload = {
      id: state.id,
      points: state.points,
      data: state.imageData,
    }
    await loading.auto(async () => {
      let id = await api.charImage.update(payload)
      if(id instanceof Error) {
        error.notify(id)
        return
      }
      data.fetchCharImages({ids:[id]})
    })
    toast.show("Success", Level.Success);
    history.goBack()
  };

  return {
    state,
    toggleSelect,
    movePoint,
    changeSize,
    addPoint,
    delPoint,
    save,
    init,
  };
};
