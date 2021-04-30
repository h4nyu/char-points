import { observable } from "mobx";
import { RootApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { State as ImageState } from "@charpoints/core/image";
import { Point, Points, Boxes, History, Level, InputMode, Box } from ".";
import { ToastStore } from "./toast";
import { Map, Set } from "immutable";
import { v4 as uuid } from "uuid";
import { keyBy, zip } from "lodash";
import { LoadingStore } from "./loading";

export type State = {
  id: string;
  labels: Set<string>;
  state: ImageState;
  loss?: number;
  label: string;
  currentLabel?: string;
  gtPoints: Points;
  gtBoxes: Boxes;
  predictedBoxes: Boxes;
  mode: InputMode;
  weight: number;
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
    gtPoints: Map(),
    gtBoxes: Map(),
    labels: Set(),
    label: "",
    state: ImageState.Todo,
    currentLabel: undefined,
    predictedBoxes: Map(),
    weight: 1.0,
    mode: InputMode.Box,
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
  setWeight: (weight: number) => void;
  addLabel: () => void;
  setLabel: (value: string) => void;
  toggleLabel: (value: string) => void;
  delLabel: (value: string) => void;
  save: (imageState: ImageState) => Promise<void>;
  copyAsGT: () => void;
  init: (id: string) => void;
  delete: () => Promise<void>;
  clear: () => void;
};
export const Editor = (root: {
  history: History;
  api: RootApi;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
  toast: ToastStore;
  error: ErrorStore;
  onSave?: (id: string) => void;
  onInit?: (id: string) => void;
  onDelete?: (id: string) => void;
}): Editor => {
  const state = observable(State());
  const {
    history,
    api,
    loading,
    toast,
    error,
    onSave,
    onInit,
    onDelete,
  } = root;
  const init = async (id: string) => {
    await loading(async () => {
      const image = await api.image.find({ id });
      if (image instanceof Error) {
        toast.show(image.message, Level.Error);
        return;
      }
      const boxes = await api.box.filter({ imageId: id });
      if (boxes instanceof Error) {
        toast.show(boxes.message, Level.Error);
        return;
      }
      state.labels = state.labels.merge(Set(boxes.map((x) => x.label || "")));
      state.currentLabel = state.labels.first();
      state.gtBoxes = Map(
        boxes.filter((x) => x.isGrandTruth === true).map((x) => [uuid(), x])
      );
      state.predictedBoxes = Map(
        boxes.filter((x) => x.isGrandTruth === false).map((x) => [uuid(), x])
      );

      const gtPoints = await api.point.filter({
        imageId: id,
        isGrandTruth: true,
      });
      if (gtPoints instanceof Error) {
        toast.show(gtPoints.message, Level.Error);
        return;
      }
      state.gtPoints = Map(gtPoints.map((x) => [uuid(), x]));
      state.id = image.id;
      state.imageData = image.data;
      onInit && onInit(id);
    });
  };
  const clear = () => {
    state.gtPoints = Map();
    state.gtBoxes = Map();
  };

  const setMode = (mode: InputMode) => {
    state.mode = mode;
  };

  const copyAsGT = () => {
    state.gtBoxes = state.predictedBoxes;
  };

  const setLabel = (value: string) => {
    state.label = value;
  };

  const toggleLabel = (value: string) => {
    if (state.currentLabel === value) {
      state.currentLabel = undefined;
    } else {
      state.currentLabel = value;
    }
  };

  const addLabel = () => {
    state.labels = state.labels.add(state.label);
    state.currentLabel = state.label;
    state.label = "";
  };

  const delLabel = (value: string) => {
    state.labels = state.labels.delete(value);
    if (state.currentLabel === value) {
      state.currentLabel = undefined;
    }
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
    const { gtPoints, gtBoxes, draggingId, mode } = state;
    state.pos = pos;
    if (draggingId === undefined) {
      return;
    }
    if (mode === InputMode.Point) {
      state.gtPoints = gtPoints.update(draggingId, (x) => ({ ...x, ...pos }));
    } else if (mode === InputMode.TL) {
      const box = gtBoxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.TR);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BL);
      }
      state.gtBoxes = gtBoxes.set(draggingId, { ...box, x0: pos.x, y0: pos.y });
    } else if (mode === InputMode.BR) {
      const box = gtBoxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.BL);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TR);
      }
      state.gtBoxes = gtBoxes.set(draggingId, { ...box, x1: pos.x, y1: pos.y });
    } else if (mode === InputMode.BL) {
      const box = gtBoxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x > box.x1) {
        return setMode(InputMode.BR);
      }
      if (pos.y < box.y0) {
        return setMode(InputMode.TL);
      }
      state.gtBoxes = gtBoxes.set(draggingId, { ...box, x0: pos.x, y1: pos.y });
    } else if (mode === InputMode.TR) {
      const box = gtBoxes.get(draggingId);
      if (box === undefined) {
        return;
      }
      if (pos.x < box.x0) {
        return setMode(InputMode.TL);
      }
      if (pos.y > box.y1) {
        return setMode(InputMode.BR);
      }
      state.gtBoxes = gtBoxes.set(draggingId, { ...box, x1: pos.x, y0: pos.y });
    }
  };

  const add = () => {
    const { mode, pos, gtBoxes, gtPoints, id } = state;
    if ((state.draggingId = undefined)) {
      state.draggingId = undefined;
      return;
    }
    const newId = uuid();
    if (mode === InputMode.Point) {
      state.gtPoints = gtPoints.set(newId, { ...Point(), ...pos, imageId: id });
    } else if (
      [
        InputMode.Box,
        InputMode.TR,
        InputMode.TL,
        InputMode.BL,
        InputMode.BR,
      ].includes(mode)
    ) {
      state.gtBoxes = state.gtBoxes.set(newId, {
        ...Box(),
        imageId: id,
        x0: pos.x,
        y0: pos.y,
        x1: pos.x,
        y1: pos.y,
        label: state.currentLabel,
      });
      setMode(InputMode.BR);
    }
    state.draggingId = newId;
  };

  const del = () => {
    const { gtPoints, gtBoxes, draggingId } = state;
    state.gtPoints = gtPoints.filter((v, k) => k !== draggingId);
    state.gtBoxes = gtBoxes.filter((v, k) => k !== draggingId);
    state.draggingId = undefined;
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const save = async (imageState: ImageState) => {
    await loading(async () => {
      const boxErr = await api.box.annotate({
        boxes: state.gtBoxes.toList().toJS(),
        imageId: state.id,
      });
      if (boxErr instanceof Error) {
        return error.notify(boxErr);
      }
      const pointErr = await api.point.annotate({
        points: state.gtPoints.toList().toJS(),
        imageId: state.id,
      });
      if (pointErr instanceof Error) {
        return error.notify(pointErr);
      }
      const imageErr = await api.image.update({
        id: state.id,
        data: state.imageData,
      });
      if (imageErr instanceof Error) {
        return error.notify(imageErr);
      }
      state.state = imageState;
      onSave && onSave(state.id);
      toast.show("Success", Level.Success);
    });
  };

  const delete_ = async () => {
    await loading(async () => {
      const id = await api.image.delete({ id: state.id });
      if (id instanceof Error) {
        error.notify(id);
        return;
      }
      onDelete && onDelete(id);
      toast.show("Success", Level.Success);
    });
  };
  const setWeight = (value: number) => {
    state.weight = value;
  };

  return {
    state,
    setMode,
    toggleDrag,
    move,
    changeSize,
    setWeight,
    addLabel,
    toggleLabel,
    setLabel,
    delLabel,
    add,
    del,
    save,
    init,
    clear,
    copyAsGT,
    delete: delete_,
  };
};
