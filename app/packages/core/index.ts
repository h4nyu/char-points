export { ErrorKind } from "./error";
import { CharImage } from "./charImage";
import { Point } from "./point";

export type CharImageStore = {
  filter: (payload: { ids?: string[] }) => Promise<CharImage[] | Error>;
  find: (payload: { id?: string }) => Promise<CharImage | undefined | Error>;
  insert: (payload: CharImage) => Promise<void | Error>;
  delete: (payload: { id?: string }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  charImage: CharImageStore;
};
