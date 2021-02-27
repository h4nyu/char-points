import { observable } from "mobx";
import { Level } from ".";
import { v4 as uuid } from "uuid";

export type ToastStore = {
  state: State;
  show: (message: string, level?: Level) => void;
  log: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
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
  const info = (message: string) => {
    show(message, Level.Info);
  };
  const error = (message: string) => {
    show(message, Level.Error);
  };
  const warn = (message: string) => {
    show(message, Level.Warning);
  };
  const log = (message: string) => {
    show(message);
  };
  return {
    state,
    show,
    info,
    error,
    warn,
    log,
  };
};
