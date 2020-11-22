import { Row, Sql } from "postgres";
import { CharImage, Point, PointType } from "@charpoints/core/charImage";
import { first } from "lodash";

const PointStore = (sql: Sql<any>) => {
  const to = (r: Row): Point => {
    return {
      x: r.x,
      y: r.y,
      pointType: r.point_type,
    };
  };
  const filter = async (payload: { imageId: string }): Promise<Point[]> => {
    const { imageId } = payload;
    let rows: Row[] = [];
    rows = await sql`SELECT * FROM points WHERE image_id=${imageId}`;
    return rows.map(to);
  };

  const insert = async (payload: {
    points: Point[];
    imageId: string;
  }): Promise<void> => {
    const { points, imageId } = payload;
    const rows = points.map((x) => {
      return {
        ...x,
        image_id: imageId,
        point_type: x.pointType,
      };
    });
    await sql` INSERT INTO points ${sql(
      rows,
      "x",
      "y",
      "point_type",
      "image_id"
    )}
    `;
  };

  const delete_ = async (payload: { imageId: string }) => {
    const { imageId } = payload;
    await sql`
    DELETE FROM
    points
    WHERE
    image_id=${imageId}
    `;
  };

  const clear = async (): Promise<void> => {
    await sql`TRUNCATE TABLE points`;
  };

  return {
    filter,
    insert,
    clear,
    delete: delete_,
  };
};

export const CharImageStore = (sql: Sql<any>) => {
  const pointStore = PointStore(sql);
  const to = (r: Row): CharImage => {
    return {
      id: r.id,
      data: (r.data && r.data.toString("base64")) || undefined,
      points: undefined,
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
        rows = await sql`SELECT * FROM char_images WHERE id=${id}`;
      }
      const row = first(rows.map(to));
      if (row === undefined) {
        return;
      }
      row.points = await pointStore.filter({ imageId: row.id });
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
      const { points, id, data, createdAt } = payload;
      await sql`
      INSERT INTO char_images (
        id,
        data,
        created_at
      ) VALUES (
        ${id},
        ${data ? Buffer.from(data, "base64") : null},
        ${createdAt}
      )
      `;
      if (!points) {
        return;
      }
      await pointStore.insert({ points, imageId: id });
    } catch (err) {
      return err;
    }
  };
  const delete_ = async (payload: { id?: string }): Promise<void | Error> => {
    try {
      const { id } = payload;
      if (id !== undefined) {
        await sql`DELETE FROM char_images WHERE id=${id}`;
        await pointStore.delete({ imageId: id });
      }
    } catch (err) {
      return err;
    }
  };
  const clear = async () => {
    try {
      await sql`TRUNCATE char_images`;
      await pointStore.clear();
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
