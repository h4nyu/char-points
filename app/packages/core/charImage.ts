import { CharImageStore, Lock, ErrorKind, CharImage } from ".";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

type Store = {
  charImage: CharImageStore;
};
export const defaultCharImage = (): CharImage => {
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
export const Service = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const filter = async (
    payload: FilterPayload
  ): Promise<CharImage[] | Error> => {
    return await store.charImage.filter(payload);
  };

  const create = async (payload: CreatePayload): Promise<string | Error> => {
    return await lock.auto(async () => {
      const row = {
        ...defaultCharImage(),
        data: payload.data,
      };
      const err = await store.charImage.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const delete_ = async (payload: DeletePayload): Promise<string | Error> => {
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
  };
};
