import { observable, computed, IComputedValue } from "mobx";
import { CharImages } from ".";
import { Map } from "immutable";
import { RootApi } from "@charpoints/api";

export type LoadingStore = {
  state: State;
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};
type State = {
  isActive: boolean;
};
const State = (): State => {
  return {
    isActive: false,
  };
};
export const LoadingStore = (): LoadingStore => {
  const state = observable(State());
  let pendingNum = 0;
  const auto = async <T>(fn: () => Promise<T>) => {
    try {
      pendingNum = pendingNum + 1;
      state.isActive = isActive();
      return await fn();
    } catch (e) {
      throw e;
    } finally {
      pendingNum = pendingNum - 1;
      state.isActive = isActive();
    }
  };
  const isActive = () => pendingNum > 0;
  return {
    state,
    auto,
  };
};
