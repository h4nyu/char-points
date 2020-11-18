import { v4 as uuidv4 } from "uuid";

export enum PointType {
  Start,
  Corner,
  Stop,
}

export type Point = {
  id: string; // Uuid
  x: number;
  y: number;
  pointType: PointType;
  imageId: string;
};

export const Point = (prev?: Point) => {
  const next = prev || {
    id: uuidv4(),
    x: 0,
    y: 0,
    pointType: PointType.Start,
    imageId: "",
  };
  return next;
};
