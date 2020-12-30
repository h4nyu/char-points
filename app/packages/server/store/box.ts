import { Row, Sql } from "postgres";
import { Box } from "@charpoints/core/box";
import { BoxStore } from "@charpoints/core";

export const Store = (sql: Sql<any>): BoxStore => {
  const to = (r: Row): Box => {
    return {
      x0: r.x0,
      y0: r.y0,
      x1: r.x1,
      y1: r.y1,
      imageId: r.image_id,
      isGrandTruth: r.is_grand_truth,
      label: r.label || undefined,
    };
  };

  const from = (b: Box): Row => {
    return {
      x0: b.x0,
      y0: b.y0,
      x1: b.x1,
      y1: b.y1,
      image_id: b.imageId,
      is_grand_truth: b.isGrandTruth,
      label: b.label || null,
    };
  };
  const filter = async (payload: { imageId?: string, isGrandTruth?:boolean }) => {
    try {
      const { imageId, isGrandTruth } = payload;
      let rows: Row[] = [];
      if (imageId !== undefined && isGrandTruth !== undefined) {
        rows = await sql`SELECT * FROM boxes WHERE image_id =${imageId} AND is_grand_truth=${isGrandTruth}`;
      } else if (imageId !== undefined) {
        rows = await sql`SELECT * FROM boxes WHERE image_id =${imageId}`;
      } else {
        rows = await sql`SELECT * FROM boxes`;
      }
      return rows.map(to);
    } catch (err) {
      return err;
    }
  };

  const load = async (payload: Box[]) => {
    try {
      if (payload.length === 0) {
        return;
      }
      const rows = payload.map(from);
      await sql` INSERT INTO boxes ${sql(
        rows,
        "x0",
        "y0",
        "x1",
        "y1",
        "image_id",
        "is_grand_truth",
        "label"
      )}
      `;
    } catch (err) {
      return err;
    }
  };

  const delete_ = async (payload: { imageId?: string, isGrandTruth?:boolean }) => {
    try {
      const { imageId, isGrandTruth } = payload;
      if (imageId !== undefined && isGrandTruth !== undefined) {
        await sql`DELETE FROM boxes WHERE image_id=${imageId} AND is_grand_truth=${isGrandTruth}`;
      }else if (imageId !== undefined) {
        await sql`DELETE FROM boxes WHERE image_id=${imageId}`;
      }
    } catch (err) {
      return err;
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await sql`TRUNCATE TABLE boxes`;
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
