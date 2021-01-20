import { observable } from "mobx";

export type LoadingStore = {
  state: State;
  loading: <T>(fn: () => Promise<T>) => Promise<T>;
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
  const loading = async <T>(fn: () => Promise<T>) => {
    try {
      pendingNum = pendingNum + 1;
      state.isActive = isActive();
      return await fn();
    } finally {
      pendingNum = pendingNum - 1;
      state.isActive = isActive();
    }
  };
  const isActive = () => pendingNum > 0;
  return {
    state,
    loading,
  };
};
