import { Store } from ".";

export type Box = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  imageId: string;
  label?: string;
};

export const Box = (): Box => {
  return {
    x0: 0.0,
    y0: 0.0,
    x1: 0.0,
    y1: 0.0,
    imageId: "",
    label: undefined,
  };
};
