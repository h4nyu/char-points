import { Store, Lock, ErrorKind } from "@charpoints/core";

export type Point = {
  x: number;
  y: number;
  imageId: string;
  label?: string;
  equals: (other:Point) => boolean;
  validate: () => void | Error;
};

export const Point = (args?: any): Point => {
  const validate = () => {
    for (const v of [self.x, self.x]) {
      if (v < 0.0 || v > 1.0) {
        return new Error(ErrorKind.PointOutOfRange);
      }
    }
  }
  const equals = (other: Point): boolean => {
    return (
      self.x === other.x && self.y === other.y
    )
  }
  const self = {
    x: 0,
    y: 0,
    imageId: "",
    label: undefined,
    validate,
    equals,
    ...args
  }
  return self
};

export type FilterPayload = {
  imageId?: string;
  isGrandTruth?: boolean;
};

export type ReplacePayload = {
  points: Point[];
  imageId: string;
};

export type PredictPayload = {
  points: Point[];
  imageId: string;
};
export type Service = {
  filter: (payload: FilterPayload) => Promise<Point[] | Error>;
  replace: (payload: ReplacePayload) => Promise<void | Error>;
};
export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const replace = async (payload: {
    imageId: string;
    points: Point[];
  }) => {
    const { imageId, points } = payload;
    return await lock.auto(async () => {
      const hasImage = await store.image.has({ id: imageId });
      if (hasImage instanceof Error) {
        return hasImage;
      }
      if (!hasImage) {
        return new Error(ErrorKind.ImageNotFound);
      }
      let err = await store.point.delete({ imageId });
      if (err instanceof Error) {
        return err;
      }
      err = await store.point.load(
        points
          .filter((x) => x.imageId === imageId)
      );
      if (err instanceof Error) {
        return err;
      }
    });
  };

  const filter = async (payload: FilterPayload) => {
    return await store.point.filter(payload);
  };
  return { filter, replace };
};
