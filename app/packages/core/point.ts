import { Store, Lock, ErrorKind } from "@charpoints/core";

export type Point = {
  x: number;
  y: number;
  imageId: string;
  label?: string;
  confidence?: number;
  isGrandTruth?: boolean;
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
  imageId?: string;
  isGrandTruth?: boolean;
};

export type AnnotatePayload = {
  points: Point[],
  imageId: string,
}

export type PredictPayload = {
  points: Point[],
  imageId: string,
}
export type Service = {
  filter: (payload: FilterPayload) => Promise<Point[] | Error>;
  annotate: (payload:AnnotatePayload) => Promise<void | Error>
  predict: (payload:PredictPayload) => Promise<void | Error>
};
export const Service = (args: { store: Store, lock: Lock }): Service => {
  const { store, lock } = args;
  const replace = async (payload:{imageId:string, points: Point[], isGrandTruth:boolean}) => {
    const { imageId, points, isGrandTruth } = payload;
    return await lock.auto(async () => {
      const img = await store.image.find({ id:imageId });
      if (img instanceof Error) { return img; }
      if (img === undefined) { return new Error(ErrorKind.ImageNotFound); }
      let err = await store.point.delete({imageId, isGrandTruth})
      if(err instanceof Error){ return err }
      err = await store.point.load(
        points.filter(x => x.imageId === imageId)
        .map(x => ({...x, isGrandTruth}))
      )
      if(err instanceof Error){ return err }
    });
  }

  const filter = async (payload: FilterPayload) => {
    return await store.point.filter(payload);
  };
  const annotate = async (payload: AnnotatePayload) => {
    return await replace({...payload, isGrandTruth:true})
  }
  const predict = async (payload: PredictPayload) => {
    return await replace({...payload, isGrandTruth:false})
  }
  return { filter, annotate, predict };
};
