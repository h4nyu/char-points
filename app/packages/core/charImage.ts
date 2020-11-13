import { Lock, ErrorKind, Store } from ".";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

export type CharImage = {
  id: string; // Uuid
  data: string; // base64 encoded string
  createdAt: string;
};

export const CharImage = (): CharImage => {
  return {
    id: uuid(),
    data: Buffer.from([]).toString("base64"),
    createdAt: dayjs().toISOString(),
  };
};

export type FilterPayload = {
  ids?: string[];
};
export type CreatePayload = {
  data: string; //base64
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
  find: (payload: FindPayload) => Promise<CharImage | Error>;
  filter: (payload: FilterPayload) => Promise<CharImage[] | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.charImage.filter(payload);
  };
  const find = async (payload: FindPayload) => {
    const res = await store.charImage.find(payload);
    if (res instanceof Error) {
      return res;
    }
    if (res === undefined) {
      return new Error(ErrorKind.CharImageNotFound);
    }
    return res;
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const row = {
        ...CharImage(),
        data: payload.data,
      };
      const err = await store.charImage.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    await lock.auto(async () => {
      const rows = await store.charImage.filter({
        ids: [payload.id],
      });
      if (rows instanceof Error) {
        return rows;
      }
      if (rows.length !== 1) {
        return new Error(ErrorKind.CharImageNotFound);
      }
      const err = await store.charImage.delete(payload);
      if (err instanceof Error) {
        return err;
      }
    });
    return payload.id;
  };

  return {
    filter,
    delete: delete_,
    create,
    find,
  };
};
