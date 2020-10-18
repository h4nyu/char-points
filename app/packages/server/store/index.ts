import postgres from "postgres";
import CharPoint from "./charPoint";

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, { max: args.max || 5 });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const charPoint = CharPoint(sql);
  return {
    charPoint,
    close,
  };
};
export default Store;
