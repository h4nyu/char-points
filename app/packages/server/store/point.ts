import { Row, Sql } from "postgres";
import { Point } from "@charpoints/core/point";
import { PointStore } from "@charpoints/core";

export const Store = (sql: Sql<any>): PointStore => {
  const to = (r: Row): Point => {
    return {
      x: r.x,
      y: r.y,
      imageId: r.image_id,
      label: r.label || undefined,
    };
  };

  const from = (p: Point): Row => {
    return {
      x: p.x,
      y: p.y,
      image_id: p.imageId,
      label: p.label || null,
    };
  };
  const filter = async (payload: { imageIds?: string[] }) => {
    try {
      const { imageIds } = payload;
      let rows: Row[] = [];
      if (imageIds !== undefined && imageIds.length > 0) {
        rows = await sql`SELECT * FROM points WHERE image_id IN (${imageIds})`;
      }else{
        rows = await sql`SELECT * FROM points`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };

  const load = async (payload: Point[]) => {
    try {
      if (payload.length === 0) {
        return;
      }
      const rows = payload.map(from);
      await sql` INSERT INTO points ${sql(rows, "x", "y", "image_id", "label")}
      `;
    } catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: { imageId?: string }) => {
    try {
      const { imageId } = payload;
      if (imageId !== undefined) {
        await sql`DELETE FROM points WHERE image_id=${imageId}`;
      }
    } catch (err) {
      return err;
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await sql`TRUNCATE TABLE points`;
    } catch (err) {
      return err;
    }
  };

  return {
    filter,
    load,
    clear,
    delete: delete_,
  };
};
