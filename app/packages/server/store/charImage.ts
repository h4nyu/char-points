import { Row, Sql } from "postgres";
import { CharImage } from "@charpoints/core/charImage";
import { CharImageStore } from "@charpoints/core";

import { first } from "lodash";

export const Store = (sql: Sql<any>): CharImageStore => {
  const to = (r: Row): CharImage => {
    return {
      id: r.id,
      data: (r.data && r.data.toString("base64")) || undefined,
      createdAt: r.created_at.toISOString(),
    };
  };
  const find = async (payload: {
    id?: string;
  }): Promise<CharImage | undefined | Error> => {
    try {
      const { id } = payload;
      let rows = [];
      if (id !== undefined) {
        rows = await sql`SELECT * FROM images WHERE id=${id}`;
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
  }): Promise<CharImage[] | Error> => {
    try {
      const { ids } = payload;
      let rows = [];
      if (ids !== undefined && ids.length > 0) {
        rows = await sql`SELECT id, created_at FROM images WHERE id IN (${ids})`;
      } else {
        rows = await sql`SELECT id, created_at FROM images`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };

  const insert = async (payload: CharImage): Promise<void | Error> => {
    try {
      const { id, data, createdAt } = payload;
      await sql`
      INSERT INTO images (
        id,
        data,
        created_at
      ) VALUES (
        ${id},
        ${data ? Buffer.from(data, "base64") : null},
        ${createdAt}
      )
      `;
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
    delete: delete_,
    insert,
    clear,
  };
};
