export { ErrorKind } from "./error";
import { CharImage } from "./charImage";
import { Point } from "./point";
import { Box } from "./box";

export type CharImageStore = {
  filter: (payload: { ids?: string[] }) => Promise<CharImage[] | Error>;
  find: (payload: { id?: string }) => Promise<CharImage | undefined | Error>;
  update: (payload: CharImage) => Promise<void | Error>;
  insert: (payload: CharImage) => Promise<void | Error>;
  delete: (payload: { id?: string }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type PointStore = {
  filter: (payload: { imageId?: string }) => Promise<Point[] | Error>;
  load: (payload: Point[]) => Promise<void | Error>;
  delete: (payload: { imageId?: string }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type BoxStore = {
  filter: (payload: { imageId?: string }) => Promise<Box[] | Error>;
  load: (payload: Box[]) => Promise<void | Error>;
  delete: (payload: { imageId?: string }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  charImage: CharImageStore;
  point: PointStore;
  box: BoxStore;
};
