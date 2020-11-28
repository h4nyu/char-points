import { observable } from "mobx";
import { RootApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Points, Point, CharImage, History, Level, InputMode, Box } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { DataStore } from "./data";

export type State = {
  id: string;
  points: Point[];
  boxes: Box[];
  mode:InputMode;
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
    boxes: [],
    mode: InputMode.Point,
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
  select: (pointId: number, mode:InputMode) => void;
  unselect: () => void;
  setMode: (mode:InputMode) => void;
  add: () => void;
  move: (pos: { x: number; y: number }) => void;
  del: (id: number) => void;
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
    state.points = charImage.points || [];
    state.boxes = charImage.boxes || [];
    state.id = charImage.id;
    state.imageData = charImage.data;
  };

  const setMode = (mode:InputMode) => {
    state.mode = mode;
  }

  const unselect = () => {
    state.draggingId = -1
  }

  const select = (id: number, mode:InputMode) => {
    state.draggingId = id;
    setMode(mode);
  };

  const move = (pos: { x: number; y: number }) => {
    let { points, boxes, draggingId, mode } = state;
    state.pos = pos;
    if (draggingId === -1) {
      return;
    }
    if(mode === InputMode.Point){
      points[draggingId] = {...points[draggingId], ...pos }
      state.points = [...points]
    }
    if(mode === InputMode.Box){
      const box = boxes[draggingId]
      const width = box.x1 - box.x0
      const height = box.y1 - box.y0
      boxes[draggingId] = {...box, x0:pos.x - width/2, y0:pos.y - height/2, x1: pos.x+width/2, y1:pos.y+height/2 }
      state.boxes = [...boxes]
    }
    else if(mode === InputMode.TL){
      const box = boxes[draggingId]
      if(pos.x > box.x1){ return setMode(InputMode.TR) }
      if(pos.y > box.y1){ return setMode(InputMode.BL) }
      boxes[draggingId] = {...box, x0: pos.x, y0: pos.y };
      state.boxes = [...boxes]
    }
    else if(mode === InputMode.BR){
      const box = boxes[draggingId]
      if(pos.x < box.x0){ return setMode(InputMode.BL) }
      if(pos.y < box.y0){ return setMode(InputMode.TR) }
      boxes[draggingId] ={...box, x1:pos.x, y1:pos.y};
      state.boxes = [...boxes]
    }
    else if(mode === InputMode.BL){
      const box = boxes[draggingId]
      if(pos.x > box.x1){ return setMode(InputMode.BR) }
      if(pos.y < box.y0){ return setMode(InputMode.TL) }
      boxes[draggingId] ={...box, x0:pos.x, y1:pos.y};
      state.boxes = [...boxes]
    }
    else if(mode === InputMode.TR){
      const box = boxes[draggingId]
      if(pos.x < box.x0){ return setMode(InputMode.TL) }
      if(pos.y > box.y1){ return setMode(InputMode.BR) }
      boxes[draggingId] ={...box, x1:pos.x, y0:pos.y};
      state.boxes = [...boxes]
    }
  };

  const add = () => {
    let { draggingId, mode, pos, boxes, points, id } = state;
    if (draggingId !== -1) {
      return;
    }

    if(mode === InputMode.Point){
      state.points = [{ ...Point(), ...pos, imageId:id }, ...points];
      state.draggingId = 0
    }
    else if(
      [InputMode.Box, InputMode.TR, InputMode.TL, InputMode.BL, InputMode.BR].includes(mode)
    ){
      state.boxes = [ {...Box(), imageId:id, x0:pos.x, y0:pos.y, x1: pos.x, y1:pos.y}, ...boxes];
      setMode(InputMode.BR)
      state.draggingId = 0
    }
  };

  const del = (id: number) => {
    const { points, draggingId, boxes, mode } = state;
    if(mode === InputMode.Point){
      state.points = points.filter((v, k) => k !== id);
    }else if(mode === InputMode.Box){
      state.boxes = boxes.filter((v, k) => k !== id);
    }
    state.draggingId = -1;
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const save = async () => {
    const payload = {
      id: state.id,
      points: state.points,
      data: state.imageData,
      boxes: state.boxes,
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
    select,
    unselect,
    setMode,
    move,
    changeSize,
    add,
    del,
    save,
    init,
  };
};
