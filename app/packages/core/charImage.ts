import { CharImageStore, Lock, ErrorKind, CharImage } from ".";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

type Store = {
  charImage: CharImageStore;
};
export const defaultCharImage = (): CharImage => {
  return {
    id: uuid(),
    content: new Buffer([]),
    createdAt: dayjs().toISOString(),
  };
};

export const Service = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const filter = async (payload: {}): Promise<CharImage[] | Error> => {
    return await store.charImage.filter(payload);
  };

  const create = async (payload: {
    content: Buffer;
  }): Promise<string | Error> => {
    return await lock.auto(async () => {
      const row = {
        ...defaultCharImage(),
        content: payload.content,
      };
      const err = await store.charImage.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const delete_ = async (payload: { id: string }): Promise<string | Error> => {
    await lock.auto(async () => {
      const rows = await store.charImage.filter(payload);
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
