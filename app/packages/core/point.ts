import { Store } from "."

export type Point = {
  x: number;
  y: number;
  imageId: string;
  label?: string;
};

export const Point = (): Point => {
  return {
    x: 0,
    y: 0,
    imageId: "",
    label: undefined,
  };
};
export type FilterPayload = { 
  imageId?: string
}
export type Service = {
  filter: (payload: FilterPayload) => Promise<Point[] | Error>;
}
export const Service = (args: { store:Store }):Service => {
  const { store } = args
  const filter = async (payload: FilterPayload) => {
    return await store.point.filter(payload)
  }
  return { filter }
}
