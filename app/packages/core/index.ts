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
  x: number;
  y: number;
  pointType: PointType;
  imageId: string;
};

export type Lock = {
  withLock: (fn: () => Promise<void>) => Promise<void>;
};
