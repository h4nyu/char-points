import { observable, computed, IComputedValue } from "mobx";
import { Level } from ".";
import { Map } from "immutable";
import { RootApi } from "@charpoints/api";
import { v4 as uuid } from "uuid"

export type ToastStore = {
  state: State;
  show: (message: string, level?: Level) => void;
};
type State = {
  message: string;
  id: string;
  level?: Level;
};
const State = (): State => {
  return {
    id: "",
    message: "",
    level: undefined
  };
};
export const ToastStore = (): ToastStore => {
  const state = observable(State());
  const show = (message: string, level?: Level) => {
    state.id = uuid();
    state.message = message;
    state.level = level
  };
  return {
    state,
    show,
  };
};

