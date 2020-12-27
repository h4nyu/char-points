import { Lock, ErrorKind, Store } from ".";
import { Point } from "./point";
import { Box } from "./box";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

export enum State {
  Done = "Done",
  Todo = "Todo",
}

export type Image = {
  id: string; // Uuid
  data?: string; // base64 encoded string
  weight: number;
  points?: Point[];
  boxes?: Box[];
  hasBox: boolean;
  hasPoint: boolean;
  state: State;
  createdAt: string;
};

export const Image = (): Image => {
  return {
    id: uuid(),
    state: State.Todo,
    hasPoint: false,
    hasBox: false,
    weight: 1.0,
    createdAt: dayjs().toISOString(),
  };
};

export type FilterPayload = {
  ids?: string[];
  hasPoint?: boolean;
  hasBox?: boolean;
  state?: State;
};

export type CreatePayload = {
  data: string; //base64
};

export type UpdatePayload = {
  id: string;
  state: State;
  data?: string;
  points?: Point[];
  boxes?: Box[];
};
export type DeletePayload = {
  id: string;
};
export type FindPayload = {
  id: string;
};
export type Service = {
  create: (payload: CreatePayload) => Promise<string | Error>;
  delete: (payload: DeletePayload) => Promise<string | Error>;
  update: (payload: UpdatePayload) => Promise<string | Error>;
  find: (payload: FindPayload) => Promise<Image | Error>;
  filter: (payload: FilterPayload) => Promise<Image[] | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.image.filter(payload);
  };
  const find = async (payload: FindPayload) => {
    const image = await store.image.find(payload);
    if (image instanceof Error) {
      return image;
    }
    if (image === undefined) {
      return new Error(ErrorKind.ImageNotFound);
    }
    const [points, boxes] = await Promise.all([
      store.point.filter({ imageId: image.id }),
      store.box.filter({ imageId: image.id }),
    ]);
    if (points instanceof Error) {
      return points;
    }
    if (boxes instanceof Error) {
      return boxes;
    }
    return {
      ...image,
      points,
      boxes,
    };
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { data } = payload;
      const row = {
        ...Image(),
        data,
      };
      const err = await store.image.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const { id, points, boxes, data } = payload;
      const row = await store.image.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      if (points !== undefined) {
        let err = await store.point.delete({ imageId: id });
        if (err instanceof Error) {
          return err;
        }
        err = await store.point.load(points.filter((x) => x.imageId === id));
        if (err instanceof Error) {
          return err;
        }
      }
      if (boxes !== undefined) {
        let err = await store.box.delete({ imageId: id });
        if (err instanceof Error) {
          return err;
        }
        err = await store.box.load(boxes.filter((x) => x.imageId === id));
        if (err instanceof Error) {
          return err;
        }
      }

      const next = {
        ...row,
        data: data || row.data,
        state: payload.state,
        hasPoint: (points && points.length > 0) || row.hasPoint,
        hasBox: (boxes && boxes.length > 0) || row.hasBox,
      };
      const err = await store.image.update(next);
      if (err instanceof Error) {
        return err;
      }
      return id;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await store.image.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      let err = await store.image.delete({ id });
      if (err instanceof Error) {
        return err;
      }
      err = await store.point.delete({ imageId: id });
      return id;
    });
  };

  return {
    filter,
    update,
    delete: delete_,
    create,
    find,
  };
};
