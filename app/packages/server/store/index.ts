import postgres from "postgres";
import { Store as PointStore } from "./point";
import { CharImageStore } from "./charImage";

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, { max: args.max || 5 });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const point = PointStore(sql);
  const charImage = CharImageStore(sql);
  return {
    charImage,
    point,
    close,
  };
};
export default Store;
