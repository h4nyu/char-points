import { Row, Sql } from "postgres";
import { CharImage } from "@charpoints/core/charImage";
import { first } from "lodash";

function to(r: Row): CharImage {
  const data = r.data
  return {
    id: r.id,
    data: data && data.toString("base64") || "",
    createdAt: r.created_at.toISOString(),
  };
}

export const CharImageStore = (sql: Sql<any>) => {
  const find = async (payload: {
    id?: string;
  }): Promise<CharImage | undefined | Error> => {
    try {
      const { id } = payload;
      let rows = [];
      if (id !== undefined) {
        rows = await sql`SELECT * FROM char_images WHERE id=${id}`;
      }
      return first(rows.map(to));
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
        rows = await sql`SELECT id, created_at FROM char_images WHERE id IN (${ids})`;
      } else {
        rows = await sql`SELECT id, created_at FROM char_images`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };

  const insert = async (payload: CharImage): Promise<void | Error> => {
    try {
      await sql`
      INSERT INTO char_images (
        id,
        data,
        created_at
      ) VALUES (
        ${payload.id},
        ${Buffer.from(payload.data, "base64")},
        ${payload.createdAt}
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
        await sql`DELETE FROM char_images WHERE id=${id}`;
      }
    } catch (err) {
      return err;
    }
  };
  const clear = async () => {
    try {
      await sql`TRUNCATE char_images`;
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
