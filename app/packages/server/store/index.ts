import postgres from "postgres";

export const Store = (args: { url: string; max?: number }) => {
  const sql = postgres(args.url, { max: args.max || 5 });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  return {
    close,
  };
};
export default Store;
