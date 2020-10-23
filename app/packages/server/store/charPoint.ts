import { Row, Sql } from "postgres";
import { CharPoint, PointType } from "@charpoints/core";
import { first } from "lodash";

function toCharPoint(r: Row): CharPoint {
  return {
    id: r.id,
    x: r.x,
    y: r.y,
    imageId: r.image_id,
    pointType: r.point_type,
  };
}

export default (sql: Sql) => {
  const filter = async (payload: {
    imageId?: string;
    pointType?: PointType;
  }): Promise<CharPoint[]> => {
    const { imageId, pointType } = payload;
    let rows: Row[] = [];
    if (imageId !== undefined && pointType !== undefined) {
      rows = await sql`SELECT * FROM char_points WHERE image_id=${imageId} AND point_type=${pointType}`;
    } else if (imageId !== undefined) {
      rows = await sql`SELECT * FROM char_points WHERE image_id=${imageId}`;
    } else if (pointType !== undefined) {
      rows = await sql`SELECT * FROM char_points WHERE point_type=${pointType}`;
    } else {
      rows = await sql`SELECT * FROM char_points`;
    }
    return rows.map(toCharPoint);
  };

  const find = async (payload: {
    id?: string;
  }): Promise<CharPoint | undefined> => {
    const { id } = payload;
    let rows: Row[] = [];
    if (id) {
      rows = await sql`SELECT * FROM char_points LIMIT 1`;
    }
    return first(rows.map(toCharPoint));
  };

  const insert = async (r: CharPoint): Promise<void> => {
    await sql`
    INSERT INTO char_points (
      id,
      x,
      y,
      point_type,
      image_id
    ) VALUES (
       ${r.id},
       ${r.x},
       ${r.y},
       ${r.pointType},
       ${r.imageId}
    )
    `;
  };

  const update = async (r: CharPoint): Promise<void> => {
    await sql`
    UPDATE 
      char_points 
    SET 
      x=${r.x}, 
      y=${r.y}, 
      point_type=${r.pointType}, 
      image_id=${r.imageId} 
    WHERE
      id=${r.id}
    `;
  };
  const delete_ = async (payload: { id?: string }) => {
    const { id } = payload;
    if (id !== undefined) {
      await sql`
      DELETE FROM 
        char_points 
      WHERE
        id=${id}
      `;
    }
  };

  const clear = async (): Promise<void> => {
    await sql`TRUNCATE TABLE char_points`;
  };

  return {
    filter,
    insert,
    update,
    clear,
    delete: delete_,
    find,
  };
};
