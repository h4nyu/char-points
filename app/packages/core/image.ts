import { Lock, ErrorKind, Store } from ".";
import { Point } from "./point";
import { Box } from "./box";
import { v4 as uuid } from "uuid";

export enum State {
  Done = "Done",
  Todo = "Todo",
}

export type Image = {
  id: string; // Uuid
  data?: string; // base64 encoded string
  name: string;
  weight: number;
  boxCount: number;
  pointCount: number;
  state: State;
  loss?: number;
  createdAt: Date;
  updatedAt: Date;
};

export const Image = (): Image => {
  return {
    id: uuid(),
    state: State.Todo,
    name: "",
    boxCount: 0,
    pointCount: 0,
    weight: 1.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export type FilterPayload = {
  ids?: string[];
  state?: State;
};

export type CreatePayload = {
  id?: string;
  name: string;
  data: string; //base64
};

export type UpdatePayload = {
  id: string;
  name?: string;
  state?: State;
  data?: string;
  loss?: number;
  gtBoxes?: Box[];
  gtPoints?: Point[];
  weight?: number;
};
export type DeletePayload = {
  id: string;
};
export type FindPayload = {
  id: string;
  hasData?: boolean;
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
    return image;
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { data, id, name } = payload;
      const row = Image();
      row.data = data;
      row.id = id || row.id || uuid();
      row.name = name;
      const prev = await store.image.find({ id: row.id });
      if (prev instanceof Error) {
        return prev;
      }
      if (prev !== undefined) {
        return new Error(ErrorKind.ImageAlreadyExist);
      }
      const err = await store.image.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const { id, data } = payload;
      const row = await store.image.find({ id, hasData:true });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      row.data = data || row.data
      row.name =  payload.name || row.name
      row.state = payload.state || row.state
      row.weight = payload.weight || row.weight
      row.loss = payload.loss || row.loss
      row.updatedAt = new Date()

      const err = await store.image.update(row);
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
      if (err instanceof Error) {
        return err;
      }
      err = await store.box.delete({ imageId: id });
      if (err instanceof Error) {
        return err;
      }
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
