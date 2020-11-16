import { Level } from ".";
import { ToastStore } from "./toast";

export type ErrorStore = {
  notify: (e: Error) => void;
};
export const ErrorStore = (args: { toast: ToastStore }): ErrorStore => {
  const { toast } = args;
  const notify = (e: Error) => {
    toast.show(e.message, Level.Error);
  };
  return {
    notify,
  };
};
