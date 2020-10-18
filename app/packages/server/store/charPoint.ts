import { Row, Sql } from "postgres";
import { CharPoint } from "@charpoints/core";
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

export default (sql: Sql<any>) => {
  const filter = async (): Promise<CharPoint[]> => {
    const rows = await sql`SELECT * FROM char_points`;
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

  const create = async (r: CharPoint): Promise<void> => {
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

  const clear = async (): Promise<void> => {
    await sql`TRUNCATE TABLE char_points`;
  };

  return {
    filter,
    create,
    update,
    clear,
    find,
  };
};
