import { Lock, ErrorKind, Store } from "@charpoints/core";
import { zip } from "lodash";

type PascalBox = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  label?: string;
}
export type Box = PascalBox & {
  imageId: string;
  label?: string;
  confidence?: number;
  isGrandTruth?: boolean;
};

export type AnnotatePayload = {
  boxes: Box[];
  imageId: string;
};

export type PredictPayload = {
  boxes: PascalBox[];
  imageId: string;
  loss?: number;
};

export type FilterPayload = {
  imageId?: string;
  isGrandTruth?: boolean;
};

export const Box = (): Box => {
  return {
    x0: 0.0,
    y0: 0.0,
    x1: 0.0,
    y1: 0.0,
    imageId: "",
  };
};
export type Service = {
  filter: (payload: FilterPayload) => Promise<Box[] | Error>;
  annotate: (payload: AnnotatePayload) => Promise<void | Error>;
  predict: (payload: PredictPayload) => Promise<void | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const replace = async (payload: {
    imageId: string;
    boxes: PascalBox[];
    isGrandTruth: boolean;
    loss?:number;
  }) => {
    const { imageId, boxes, isGrandTruth, loss } = payload;
    return await lock.auto(async () => {
      const img = await store.image.find({ id: imageId });
      if (img instanceof Error) {
        return img;
      }
      if (img === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      let err = await store.box.delete({ imageId, isGrandTruth });
      if (err instanceof Error) {
        return err;
      }
      err = await store.box.load(
        boxes
          .map((x:any) => ({ ...x, isGrandTruth, imageId }))
      );
      if (err instanceof Error) {
        return err;
      }
      const nextImg = {
        ...img,
        boxCount: isGrandTruth ? boxes.length : img.boxCount,
        loss: !isGrandTruth && loss || undefined,
        updatedAt: isGrandTruth ? new Date() :img.updatedAt,
      };
      err = await store.image.update(nextImg);
      if (err instanceof Error) {
        return err;
      }
    });
  };
  const filter = async (payload: FilterPayload) => {
    return await store.box.filter(payload);
  };
  const annotate = async (payload: AnnotatePayload) => {
    return await replace({ ...payload, isGrandTruth: true });
  };
  const predict = async (payload: PredictPayload) => {
    return await replace({ ...payload, isGrandTruth: false });
  };
  return {
    filter,
    annotate,
    predict,
  };
};
