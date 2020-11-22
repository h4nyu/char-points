import { observable } from "mobx";
import { Point, CharImage } from "."
import { DataStore } from "./data";

export type State = {
  points: Point[];
  imageData?: string
  draggingId: number
};
export const State = ():State => {
  return {
    points:[],
    imageData: undefined,
    draggingId: -1,
  }
}

export type EditChartImage = {
  state: State;
  startDrag: (pointId: number) => void;
  endDrag: () => void;
  movePoint: (pos: {x: number, y: number}) => void;
  init: (charImage: CharImage) => void;
};
export const EditChartImage = (root: {data:DataStore}):EditChartImage => {
  const state = observable(State())
  const init = (charImage: CharImage) => {
    state.imageData = charImage.data;
    state.points = charImage.points || [];
  }

  const startDrag = (pointId: number) => {
    state.draggingId = pointId;
  }

  const endDrag = () => {
    state.draggingId = -1;
  }

  const movePoint = (pos: {x:number, y:number}) => {
    const {points, draggingId} = state
    if(draggingId === -1) { return}
    const point = points[draggingId]
    points[draggingId] = {
      ...point,
      ...pos
    }
    state.points = [...points]
  }

  return {
    state,
    startDrag,
    endDrag,
    movePoint,
    init,
  };
};
