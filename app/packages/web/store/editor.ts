import { observable } from "mobx";
import { RootApi, DetectionApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { State as ImageState } from "@charpoints/core/charImage";
import {
  Point,
  Points,
  Boxes,
  CharImage,
  History,
  Level,
  InputMode,
  Box,
} from ".";
import { ToastStore } from "./toast";
import { Map } from "immutable";
import { v4 as uuid } from "uuid";
import { uniq, keyBy } from "lodash";
import { LoadingStore } from "./loading";
import { DataStore } from "./data";

export type State = {
  id: string;
  points: Points;
  boxes: Boxes;
  mode: InputMode;
  imageData?: string;
  draggingId?: string;
  size: number;
  pos: {
    x: number;
    y: number;
  };
};
export const State = (): State => {
  return {
    id: "",
    points: Map(),
    boxes: Map(),
    mode: InputMode.Point,
    imageData: undefined,
    draggingId: undefined,
    size: 512,
    pos: {
      x: 0.5,
      y: 0.5,
    },
  };
};

export type Editor = {
  state: State;
  toggleDrag: (id: string, mode: InputMode) => void;
  setMode: (mode: InputMode) => void;
  add: () => void;
  move: (pos: { x: number; y: number }) => void;
  del: () => void;
  changeSize: (size: number) => void;
  detectBoxes: () => void;
  save: (imageState:ImageState) => Promise<void>;
  init: (id: string) => void;
  next: () => void;
  clear: () => void;
};
export const Editor = (root: {
  data: DataStore;
  history: History;
  api: RootApi;
  detectionApi: DetectionApi;
  loading: LoadingStore;
  toast: ToastStore;
  error: ErrorStore;
}): Editor => {
  const state = observable(State());
  const { history, data, api, loading, toast, error, detectionApi } = root;
  const init = async (id: string) => {
    data.fetchCharImages({ ids: [id] });
    history.push("/edit");
    const charImage = data.state.charImages.get(id);
    if (charImage === undefined) {
      return;
    }
    state.points = Map((charImage.points || []).map((x) => [uuid(), x]));
    state.boxes = Map((charImage.boxes || []).map((x) => [uuid(), x]));
    state.id = charImage.id;
    state.imageData = charImage.data;
  };
  const clear = () => {
    state.points = Map();
    state.boxes = Map();
  }
  const next = () => {
    const item = data.state.charImages.filter(x => x.state ==　ImageState.Todo).find(x => x.id !== state.id)
    if(item === undefined) { return }
    init(item.id)
  }

  const setMode = (mode: InputMode) => {
    state.mode = mode;
  };

  const toggleDrag = (id: string, mode: InputMode) => {
    const { draggingId } = state;
    if (draggingId === id) {
      state.draggingId = undefined;
    } else {
      state.draggingId = id;
    }
    setMode(mode);
  };

  const move = (pos: { x: number; y: number }) => {
    const { points, boxes, draggingId, mode } = state;
    state.pos = pos;
    if (draggingId === undefined) {
      return;
    }
    if (mode === InputMode.Point) {
      state.points = points.update(draggingId, (x) => ({ ...x, ...pos }));
    } else if (mode === InputMode.TL) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.TR);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BL);
      }
      state.boxes = boxes.set(draggingId, { ...box, x0: pos.x, y0: pos.y });
    } else if (mode === InputMode.BR) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.BL);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TR);
      }
      state.boxes = boxes.set(draggingId, { ...box, x1: pos.x, y1: pos.y });
    } else if (mode === InputMode.BL) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.BR);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TL);
      }
      state.boxes = boxes.set(draggingId, { ...box, x0: pos.x, y1: pos.y });
    } else if (mode === InputMode.TR) {
      const box = boxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.TL);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BR);
      }
      state.boxes = boxes.set(draggingId, { ...box, x1: pos.x, y0: pos.y });
    }
  };

  const add = () => {
    console.log("add");
    const { draggingId, mode, pos, boxes, points, id } = state;
    if ((state.draggingId = undefined)) {
      state.draggingId = undefined;
      return;
    }
    const newId = uuid();
    if (mode === InputMode.Point) {
      state.points = points.set(newId, { ...Point(), ...pos, imageId: id });
    } else if (
      [
        InputMode.Box,
        InputMode.TR,
        InputMode.TL,
        InputMode.BL,
        InputMode.BR,
      ].includes(mode)
    ) {
      state.boxes = state.boxes.set(newId, {
        ...Box(),
        imageId: id,
        x0: pos.x,
        y0: pos.y,
        x1: pos.x,
        y1: pos.y,
      });
      setMode(InputMode.BR);
    }
    state.draggingId = newId;
  };

  const del = () => {
    const { points, boxes, mode, draggingId } = state;
    state.points = points.filter((v, k) => k !== draggingId);
    state.boxes = boxes.filter((v, k) => k !== draggingId);
    state.draggingId = undefined;
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const detectBoxes = async () => {
    const { imageData } = state;
    if (imageData === undefined) {
      return;
    }
    const res = await detectionApi.detect({ data: imageData });
    if (res instanceof Error) {
      return error.notify(res);
    }
    state.boxes = Map(
      keyBy(
        res.boxes.map((b) => ({ ...b, imageId: state.id })),
        (_) => uuid()
      )
    );
    state.imageData = res.imageData;
  };

  const save = async (imageState:ImageState) => {
    const payload = {
      id: state.id,
      points: state.points.toList().toJS(),
      data: state.imageData,
      boxes: state.boxes.toList().toJS(),
      state: imageState,
    };
    await loading.auto(async () => {
      const id = await api.charImage.update(payload);
      if (id instanceof Error) {
        error.notify(id);
        return;
      }
      toast.show("Success", Level.Success);
      await data.fetchCharImages({ ids: [id] });
      if(imageData === ImageData.Done) {
        next()
      }else{
        history.goBack();
      }
    });
  };

  return {
    state,
    setMode,
    toggleDrag,
    move,
    changeSize,
    detectBoxes,
    add,
    del,
    save,
    init,
    next,
    clear,
  };
};
