import { Row, Sql } from "postgres";
import { Point, PointType } from "@charpoints/core/point";
import { PointStore } from "@charpoints/core";
import { first } from "lodash";

function to(r: Row): Point {
  return {
    id: r.id,
    x: r.x,
    y: r.y,
    imageId: r.image_id,
    pointType: r.point_type,
  };
}

export const Store = (sql: Sql<any>): PointStore => {
  const filter = async (payload: {
    imageId?: string;
    pointType?: PointType;
  }): Promise<Point[] | Error> => {
    const { imageId, pointType } = payload;
    let rows: Row[] = [];
    if (imageId !== undefined && pointType !== undefined) {
      rows = await sql`SELECT * FROM points WHERE image_id=${imageId} AND point_type=${pointType}`;
    } else if (imageId !== undefined) {
      rows = await sql`SELECT * FROM points WHERE image_id=${imageId}`;
    } else if (pointType !== undefined) {
      rows = await sql`SELECT * FROM points WHERE point_type=${pointType}`;
    } else {
      rows = await sql`SELECT * FROM points`;
    }
    return rows.map(to);
  };

  const insert = async (payload: Point[]): Promise<void | Error> => {
    const rows = payload.map((x) => {
      return {
        ...x,
        image_id: x.imageId,
        point_type: x.pointType,
      };
    });
    try {
      await sql` INSERT INTO points ${sql(
        rows,
        "id",
        "x",
        "y",
        "point_type",
        "image_id"
      )}
    `;
    } catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: { imageId?: string }) => {
    const { imageId } = payload;
    try {
      if (imageId !== undefined) {
        await sql`
        DELETE FROM 
        points 
        WHERE
        image_id=${imageId}
        `;
      }
    } catch (err) {
      return err;
    }
  };

  const clear = async (): Promise<void | Error> => {
    try {
      await sql`TRUNCATE TABLE points`;
    } catch (err) {
      return err;
    }
  };

  return {
    filter,
    insert,
    clear,
    delete: delete_,
  };
};
