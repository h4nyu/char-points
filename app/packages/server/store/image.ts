import { Row, Sql } from "postgres";
import { Image, State } from "@charpoints/core/image";
import { ImageStore } from "@charpoints/core";

import { first } from "lodash";

const COLUMNS = [
  "id",
  "data",
  "created_at",
  "state",
  "weight",
  "loss",
  "name",
  "box_count",
  "point_count",
  "updated_at"
]

const COLUMNS_NO_DATA = [
  "id",
  "created_at",
  "state",
  "weight",
  "loss",
  "name",
  "box_count",
  "point_count",
  "updated_at"
]

export const Store = (sql: Sql<any>): ImageStore => {
  const to = (r: Row): Image => {
    return {
      ...Image(),
      id: r.id,
      data: (r.data && r.data.toString("base64")) || undefined,
      name: r.name,
      boxCount: r.box_count,
      pointCount: r.point_count,
      weight: r.weight,
      state: r.state,
      loss: r.loss || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  };

  const from = (r: Image): Row => {
    return {
      id: r.id,
      data: (r.data && Buffer.from(r.data, "base64")) || null,
      name: r.name,
      point_count: r.pointCount,
      box_count: r.boxCount,
      weight: r.weight,
      loss: r.loss || null,
      state: r.state,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    };
  };
  const find = async (payload: {
    id?: string;
    hasData?: boolean;
  }): Promise<Image | undefined | Error> => {
    try {
      const { id, hasData } = payload;
      let rows = [];
      if (id !== undefined && hasData) {
        rows = await sql`SELECT ${sql(COLUMNS)} FROM images WHERE id=${id}`;
      }
      else if (id !== undefined && !hasData) {
        rows = await sql`SELECT ${sql(COLUMNS_NO_DATA)} FROM images WHERE id=${id}`;
      }
      const row = first(rows.map(to));
      if (row === undefined) {
        return;
      }
      return row;
    } catch (err) {
      return err;
    }
  };
  const filter = async (payload: {
    ids?: string[];
    state?: State;
  }): Promise<Image[] | Error> => {
    try {
      const { ids, state } = payload;
      let rows = [];
      if (ids !== undefined && ids.length > 0) {
        rows = await sql`SELECT ${sql(
          COLUMNS_NO_DATA
        )} FROM images WHERE id IN (${ids})`;
      } else if (state !== undefined) {
        rows = await sql`SELECT ${sql(COLUMNS_NO_DATA)} FROM images WHERE state = ${state}`;
      } else {
        rows = await sql`SELECT ${sql(COLUMNS_NO_DATA)} FROM images`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };
  const update = async (payload: Image): Promise<void | Error> => {
    try {
      const { id, data, createdAt } = payload;
      await sql`
      UPDATE images 
      SET 
        ${sql(
          from(payload),
          ...COLUMNS,
        )}
      WHERE 
        id=${payload.id} 
      `;
    } catch (err) {
      return err;
    }
  };

  const insert = async (payload: Image): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO images ${sql(
        from(payload),
        ...COLUMNS,
      )}`;
    } catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: { id?: string }): Promise<void | Error> => {
    try {
      const { id } = payload;
      if (id !== undefined) {
        await sql`DELETE FROM images WHERE id=${id}`;
      }
    } catch (err) {
      return err;
    }
  };
  const clear = async () => {
    try {
      await sql`TRUNCATE images`;
    } catch (err) {
      return err;
    }
  };

  return {
    find,
    filter,
    update,
    delete: delete_,
    insert,
    clear,
  };
};
