import { observable } from "mobx";
import { Set } from "immutable";
import { State as ImageState } from "@charpoints/core/image";

export type State = {
  hasBox: boolean;
  hasPoint: boolean;
  state: ImageState;
};

export const State = (): State => {
  return {
    hasBox: false,
    hasPoint: false,
    state: ImageState.Todo,
  };
};
export type Board = {
  state: State;
  toggleHasPoint: () => void;
  toggleHasBox: () => void;
  setState: (value: ImageState) => void;
};

export const Board = () => {
  const state = observable(State());
  const toggleHasPoint = () => {
    state.hasPoint = !state.hasPoint;
  };

  const toggleHasBox = () => {
    state.hasBox = !state.hasBox;
  };

  const setState = (imageState: ImageState) => {
    state.state = imageState;
  };

  return {
    state,
    toggleHasPoint,
    toggleHasBox,
    setState,
  };
};
