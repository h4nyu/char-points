export { ErrorKind } from "./error";

export enum PointType {
  Start,
  Stop,
}

export type CharPoint = {
  id: string; // Uuid
  x: number;
  y: number;
  pointType: PointType;
  imageId: string;
};

export type CharImage = {
  id: string; // Uuid
  data: string; // base64 encoded string
  createdAt: string;
};

export type CharImageStore = {
  filter: (payload: { ids?: string[] }) => Promise<CharImage[] | Error>;
  insert: (payload: CharImage) => Promise<void | Error>;
  delete: (payload: { id?: string }) => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};
