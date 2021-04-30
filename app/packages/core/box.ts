import { Lock, ErrorKind, Store } from "@charpoints/core";
import { zip } from "lodash";

type PascalBox = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  label?: string;
};
export type Box = PascalBox & {
  imageId: string;
  label?: string;
  validate: () => void | Error;
  equals: (other:PascalBox) => boolean
};
export const Box = (args?:any) => {
  const validate = () => {
    if (self.x0 >= self.x1 || self.y0 >= self.y1) {
      return new Error(ErrorKind.ZeroSizeBox);
    }
  }
  const equals = (other:Box) => {
    return (
      self.x0 === other.x0 
      && self.y0 === other.y0 
      && self.x1 === other.x1 
      && self.y1 === other.y1
    )
  }
  const self = {
    x0: 0.0,
    y0: 0.0,
    x1: 0.0,
    y1: 0.0,
    imageId: "",
    label: undefined,
    validate,
    equals,
    ...args
  };
  return self;
}

export type ReplacePayload = {
  boxes: PascalBox[];
  imageId: string;
};

export type FilterPayload = {
  imageId?: string;
};

export type Service = {
  filter: (payload: FilterPayload) => Promise<Box[] | Error>;
  replace: (payload: ReplacePayload) => Promise<void | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const replace = async (payload: {
    imageId: string;
    boxes: PascalBox[];
  }) => {
    const { imageId } = payload;
    const boxes = payload.boxes.map((b) => Box(b));
    for (const b of boxes) {
      const bErr = b.validate();
      if (bErr instanceof Error) {
        return bErr;
      }
    }
    return await lock.auto(async () => {
      const img = await store.image.find({ id: imageId });
      if (img instanceof Error) {
        return img;
      }
      if (img === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      let err = await store.box.delete({ imageId });
      if (err instanceof Error) {
        return err;
      }
      err = await store.box.load(
        boxes.filter((x) => x.imageId === imageId)
      );
      if (err instanceof Error) {
        return err;
      }
    });
  };
  const filter = async (payload: FilterPayload) => {
    return await store.box.filter(payload);
  };
  return {
    filter,
    replace,
  };
};
