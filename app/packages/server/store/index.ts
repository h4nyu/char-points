import postgres from "postgres";
import { Store as CharImageStore } from "./charImage";
import { Store as PointStore } from "./point"

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, { max: args.max || 5 });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const charImage = CharImageStore(sql);
  const point = PointStore(sql);
  return {
    charImage,
    point,
    close,
  };
};
export default Store;
