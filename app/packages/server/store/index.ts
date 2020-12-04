import postgres from "postgres";
import { Store as CharImageStore } from "./charImage";
import { Store as PointStore } from "./point";
import { Store as BoxStore } from "./box";

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, {
    max: args.max || 5,
    debug: process.env.NODE_ENV === "development" ? console.debug : undefined,
  });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const charImage = CharImageStore(sql);
  const point = PointStore(sql);
  const box = BoxStore(sql);
  return {
    charImage,
    point,
    box,
    close,
  };
};
export default Store;
