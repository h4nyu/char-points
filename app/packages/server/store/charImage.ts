import { Row, Sql } from "postgres";
import { CharImage } from "@charpoints/core";

function to(r: Row): CharImage {
  return {
    id: r.id,
    data: r.data.toString("base64"),
    createdAt: r.created_at.toISOString(),
  };
}

export const CharImageStore = (sql: Sql<any>) => {
  const filter = async (payload: {}): Promise<CharImage[] | Error> => {
    try {
      const rows = await sql`SELECT * FROM char_images`;
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
    filter,
    delete: delete_,
    insert,
    clear,
  };
};
