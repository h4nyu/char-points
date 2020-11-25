import { Lock, ErrorKind, Store } from ".";
import { Point } from "./point";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

export type CharImage = {
  id: string; // Uuid
  data?: string; // base64 encoded string
  createdAt: string;
};

export type LabelMe = {
  version: string;
  shapes: {
    label: string;
    line_color: string | null;
    fill_color: string | null;
    shape_type: string;
    points: [number, number][];
  }[];
  imagePath: string;
  imageData: string;
  imageHeight: number;
  imageWidth: number;
};

export const fromLabelMe = (prev: any): [CharImage, Point[]] => {
  const image = CharImage();
  image.data = prev.imageData;
  const points = prev.shapes.map((s) => {
    const [x, y] = s.points[0];
    return {
      x: x / prev.imageWidth,
      y: y / prev.imageHeight,
      imageId: image.id,
    };
  });
  return [image, points];
};

export const CharImage = (): CharImage => {
  return {
    id: uuid(),
    createdAt: dayjs().toISOString(),
  };
};

export type FilterPayload = {
  ids?: string[];
};
export type CreatePayload = {
  data: string; //base64
  points?: Point[];
};

export type UpdatePayload = {
  id: string;
  points: Point[];
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
      const { data, points } = payload;
      const row = {
        ...CharImage(),
        data,
      };
      let err = await store.charImage.insert(row);
      if (err instanceof Error) {
        return err;
      }
      if (points) {
        err = await store.point.load(points);
      }
      return row.id;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const { id, points } = payload;
      const row = await store.charImage.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.CharImageNotFound);
      }
      let err = await store.point.delete({ imageId: id });
      if (err instanceof Error) {
        return err;
      }
      err = await store.point.load(points.filter((x) => x.imageId === id));
      if (err instanceof Error) {
        return err;
      }
      return id;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await store.charImage.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.CharImageNotFound);
      }
      let err = await store.charImage.delete({ id });
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
