import { observable } from "mobx";
import { RootApi, DetectionApi } from "@charpoints/api";
import { ErrorStore } from "./error";
import { Point, Points, Boxes,  CharImage, History, Level, InputMode, Box } from ".";
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
  mode:InputMode;
  imageData?: string;
  draggingId?: string;
  selectedIds: string[];
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
    selectedIds: [],
    size: 512,
    pos: {
      x: 0.5,
      y: 0.5,
    },
  };
};

export type EditChartImage = {
  state: State;
  startDrag:(id:string, mode:InputMode) => void
  endDrag:() => void;
  toggleSelect: (pointId: string, mode:InputMode) => void;
  setMode: (mode:InputMode) => void;
  add: () => void;
  move: (pos: { x: number; y: number }) => void;
  del: () => void;
  changeSize: (size: number) => void;
  detectBoxes: () => void;
  save: () => Promise<void>;
  init: (id: string) => void;
};
export const EditChartImage = (root: {
  data: DataStore;
  history: History;
  api: RootApi;
  detectionApi: DetectionApi;
  loading: LoadingStore;
  toast: ToastStore;
  error: ErrorStore;
}): EditChartImage => {
  const state = observable(State());
  const { history, data, api, loading, toast, error, detectionApi } = root;
  const init = async (id: string) => {
    history.push("/edit");
    const charImage = data.state.charImages.get(id);
    if (charImage === undefined) {
      return;
    }
    state.points = Map((charImage.points || []).map(x => [uuid(), x]));
    state.boxes = Map((charImage.boxes || []).map(x => [uuid(), x]));
    state.id = charImage.id;
    state.imageData = charImage.data;
  };

  const setMode = (mode:InputMode) => {
    state.mode = mode;
  }

  const endDrag = () => {
    state.draggingId = undefined
  }

  const startDrag = (id: string, mode:InputMode) => {
    state.draggingId = id;
    setMode(mode);
  };

  const toggleSelect = (id: string, mode:InputMode) => {
    const { selectedIds } = state
    if( selectedIds.includes(id)) {
      state.selectedIds = selectedIds.filter(x => x !== id)
    }else{
      state.selectedIds = [...selectedIds, id]
    }
  };

  const move = (pos: { x: number, y: number }) => {
    let { points, boxes, draggingId, mode } = state;
    state.pos = pos;
    if (draggingId === undefined) {
      return;
    }
    if(mode === InputMode.Point){
      state.points = points.update(draggingId, x => ({...x, ...pos}))
    }
    console.log(mode)
    if(mode === InputMode.Box){
      state.boxes = boxes.update(draggingId, box => {
        const width = box.x1 - box.x0
        const height = box.y1 - box.y0
        return {
          ...box, 
          x0:pos.x - width/2, 
          y0:pos.y - height/2, 
          x1: pos.x+width/2, 
          y1:pos.y+height/2
        }
      })
    }
    else if(mode === InputMode.TL){
      const box = boxes.get(draggingId)
      if(box === undefined) {return}
      if(pos.x > box.x1){ return setMode(InputMode.TR) }
      if(pos.y > box.y1){ return setMode(InputMode.BL) }
      state.boxes = boxes.set(draggingId, {...box, x0: pos.x, y0: pos.y });
    }
    else if(mode === InputMode.BR){
      const box = boxes.get(draggingId)
      if(box === undefined) {return}
      if(pos.x < box.x0){ return setMode(InputMode.BL) }
      if(pos.y < box.y0){ return setMode(InputMode.TR) }
      state.boxes = boxes.set(draggingId, {...box, x1:pos.x, y1:pos.y });
    }
    else if(mode === InputMode.BL){
      const box = boxes.get(draggingId)
      if(box === undefined) {return}
      if(pos.x > box.x1){ return setMode(InputMode.BR) }
      if(pos.y < box.y0){ return setMode(InputMode.TL) }
      state.boxes = boxes.set(draggingId, {...box, x0:pos.x, y1:pos.y });
    }
    else if(mode === InputMode.TR){
      const box = boxes.get(draggingId)
      if(box === undefined) {return}
      if(pos.x < box.x0){ return setMode(InputMode.TL) }
      if(pos.y > box.y1){ return setMode(InputMode.BR) }
      state.boxes = boxes.set(draggingId, {...box, x1:pos.x, y0:pos.y });
    }
  };

  const add = () => {
    let { draggingId, mode, pos, boxes, points, id } = state;
    if (draggingId !== undefined) {
      return;
    }

    const newId = uuid()
    if(mode === InputMode.Point){
      state.points = points.set(newId, { ...Point(), ...pos, imageId:id })
    }
    else if(
      [InputMode.Box, InputMode.TR, InputMode.TL, InputMode.BL, InputMode.BR].includes(mode)
    ){
      state.boxes = state.boxes.set(newId, {...Box(), imageId:id, x0:pos.x, y0:pos.y, x1: pos.x, y1:pos.y})
      setMode(InputMode.BR)
    }
    state.draggingId = newId
  };

  const del = () => {
    const { points, selectedIds, boxes, mode } = state;
    if(mode === InputMode.Point){
      state.points = points.filter((v, k) => !selectedIds.includes(k));
    }else if(mode === InputMode.Box){
      state.boxes = boxes.filter((v, k) => !selectedIds.includes(k));
    }
    state.selectedIds = []
    state.draggingId = undefined;
  };

  const changeSize = (value: number) => {
    state.size = value;
  };

  const detectBoxes = async () => {
    const { imageData } = state
    if(imageData === undefined){return}
    const res = await detectionApi.detect({data: imageData})
    if(res instanceof Error) { return error.notify(res) }
    state.boxes = Map(keyBy(res.boxes.map(b => ({...b, imageId: state.id})), _ => uuid()))
    state.imageData = res.imageData
  };

  const save = async () => {
    const payload = {
      id: state.id,
      points: state.points.toList().toJS(),
      data: state.imageData,
      boxes: state.boxes.toList().toJS(),
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
    setMode,
    startDrag,
    endDrag,
    move,
    changeSize,
    detectBoxes,
    add,
    del,
    save,
    init,
  };
};
