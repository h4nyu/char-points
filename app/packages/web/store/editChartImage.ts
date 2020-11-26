import { observable } from "mobx";
import { RootApi } from "@charpoints/api";
import { List } from "immutable"
import { ErrorStore } from "./error";
import { Points, Point, CharImage, History, Level } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { DataStore } from "./data";

export type State = {
  id: string;
  points: Points;
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
    points: List(),
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
export const EditChartImage = (root: {
  data: DataStore;
  history: History;
  api: RootApi;
  loading: LoadingStore;
  toast: ToastStore;
  error: ErrorStore;
}): EditChartImage => {
  const state = observable(State());
  const { history, data, api, loading, toast, error } = root;
  const init = async (id: string) => {
    history.push("/edit");
    const charImage = data.state.charImages.get(id);
    if (charImage === undefined) {
      return;
    }
    const points = data.state.points.filter(x => x.imageId === charImage.id) ;
    state.points = points;
    state.id = charImage.id;
    state.imageData = charImage.data;
  };

  const toggleSelect = (pointId?: number) => {
    if (pointId !== undefined && state.draggingId !== pointId) {
      state.draggingId = pointId;
    } else {
      state.draggingId = -1;
    }
  };

  const movePoint = (pos: { x: number; y: number }) => {
    let { points, draggingId } = state;
    state.pos = pos;
    if (draggingId === -1) {
      return;
    }
    const point = points.get(draggingId);
    if(!point){return}
    state.points = points.set(draggingId, {...point, ...pos})
  };

  const addPoint = () => {
    if (state.draggingId !== -1) {
      return;
    }
    let { points, id } = state;
    state.points = points.push({ ...Point(), ...state.pos, imageId:id });
    state.draggingId = state.points.size - 1
  };

  const delPoint = (pointId: number) => {
    const { points, draggingId } = state;
    state.points = points.filter((v, k) => k !== pointId);
    state.draggingId = -1;
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const save = async () => {
    const payload = {
      id: state.id,
      points: state.points.toJS(),
      data: state.imageData,
    };
    await loading.auto(async () => {
      const id = await api.charImage.update(payload);
      if (id instanceof Error) {
        error.notify(id);
        return;
      }
      data.fetchCharImages({ ids: [id] });
    });
    toast.show("Success", Level.Success);
    history.goBack();
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
