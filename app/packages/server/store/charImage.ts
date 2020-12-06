import { Row, Sql } from "postgres";
import { CharImage } from "@charpoints/core/charImage";
import { CharImageStore } from "@charpoints/core";

import { first } from "lodash";

export const Store = (sql: Sql<any>): CharImageStore => {
  const to = (r: Row): CharImage => {
    return {
      id: r.id,
      data: (r.data && r.data.toString("base64")) || undefined,
      hasPoint: r.has_point || undefined,
      hasBox: r.has_box || undefined,
      createdAt: r.created_at.toISOString(),
    };
  };

  const from = (r: CharImage): Row => {
    return {
      id: r.id,
      data: (r.data && Buffer.from(r.data, "base64")) || null,
      has_point: r.hasPoint || null,
      has_box: r.hasBox || null,
      created_at: r.createdAt,
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
    hasPoint?: boolean;
    hasBox?: boolean;
  }): Promise<CharImage[] | Error> => {
    try {
      const { ids, hasBox, hasPoint } = payload;
      let rows = [];
      if (ids !== undefined && ids.length > 0) {
        rows = await sql`SELECT id, created_at, has_point, has_box FROM images WHERE id IN (${ids})`;
      } else if (hasBox !== undefined && hasPoint !== undefined) {
        rows = await sql`SELECT id, created_at, has_point, has_box FROM images WHERE has_box = ${hasBox} AND has_point = ${hasPoint}`;
      } else if (hasBox !== undefined) {
        rows = await sql`SELECT id, created_at, has_point, has_box FROM images WHERE has_box = ${hasBox}`;
      } else if (hasPoint !== undefined) {
        rows = await sql`SELECT id, created_at, has_point, has_box FROM images WHERE has_point = ${hasPoint}`;
      } else {
        rows = await sql`SELECT id, created_at, has_point, has_box FROM images`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };
  const update = async (payload: CharImage): Promise<void | Error> => {
    try {
      const { id, data, createdAt } = payload;
      await sql`
      UPDATE images 
      SET 
        ${sql(from(payload), "data", "created_at", "has_point", "has_box")}
      WHERE 
        id=${payload.id} 
      `;
    } catch (err) {
      return err;
    }
  };

  const insert = async (payload: CharImage): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO images ${sql(
        from(payload),
        "id",
        "data",
        "created_at",
        "has_box",
        "has_point"
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
