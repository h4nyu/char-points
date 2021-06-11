import { Row, Sql } from "postgres";
import { Image, State } from "@charpoints/core/image";
import { ImageStore } from "@charpoints/core";

import { first } from "lodash";

const COLUMNS = [
  "id",
  "data",
  "created_at",
  "name",
]

export const Store = (sql: Sql<any>): ImageStore => {
  const to = (r: Row): Image => {
    return Image({
      id: r.id,
      data: (r.data && r.data.toString("base64")) || undefined,
      name: r.name,
      createdAt: r.created_at,
    });
  };
  const from = (r: Image): Row => {
    return {
      id: r.id,
      data: (r.data && Buffer.from(r.data, "base64")) || null,
      name: r.name,
      created_at: r.createdAt,
    };
  };
  const find = async (payload: {
    id?: string;
  }): Promise<Image | undefined | Error> => {
    try {
      const { id } = payload;
      let rows = [];
      if (id !== undefined) {
        rows = await sql`SELECT * FROM images WHERE id=${id}`;
      }
      const row = first(rows.map(to));
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
      const rows = await (async () => {
        if (ids !== undefined && ids.length > 0) {
          return await sql`SELECT * FROM images WHERE id IN (${ids})`;
        } else if (state !== undefined) {
          return await sql`SELECT * FROM images WHERE state = ${state}`;
        } else if (ids === undefined && state === undefined) {
          await sql`SELECT * FROM images`;
        }
        return []
      })()
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

  const has = async (payload: { id?:string }): Promise<boolean | Error> => {
    try {
      const { id } = payload;
      let res = false
      if(id !== undefined) {
        // res = await sql`SELECT EXISTS (SELECT * FROM images WHERE id=${id})`;
      }
      return res;
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

  const replace = async (payload: Image): Promise<void | Error> => {
    try {
      await sql.begin(async sql => {
        await sql`DELETE FROM images WHERE id=${payload.id}`;
      })
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
    has,
    delete: delete_,
    replace,
    insert,
    clear,
  };
};
