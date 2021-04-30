import postgres from "postgres";
import { Store as ImageStore } from "./image";
import { Store as PointStore } from "./point";
import { Store as BoxStore } from "./box";
import { crop } from "./transform";

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, {
    max: args.max || 5,
  });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const image = ImageStore(sql);
  const point = PointStore(sql);
  const box = BoxStore(sql);
  return {
    crop,
    image,
    point,
    box,
    close,
  };
};
export default Store;
