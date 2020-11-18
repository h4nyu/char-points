import { observable } from "mobx";
import { Level } from ".";
import { v4 as uuid } from "uuid";

export type ToastStore = {
  state: State;
  show: (message: string, level?: Level) => void;
};

type State = {
  message: {
    message: string;
    id: string;
    level?: Level;
  };
};

const State = (): State => {
  return {
    message: {
      id: "",
      message: "",
      level: undefined,
    },
  };
};
export const ToastStore = (): ToastStore => {
  const state = observable(State());
  const show = (message: string, level?: Level) => {
    state.message = {
      id: uuid(),
      message,
      level,
    };
  };
  return {
    state,
    show,
  };
};
