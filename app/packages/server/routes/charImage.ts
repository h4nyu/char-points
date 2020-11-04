import { Sql } from "postgres";
import { CharImage } from "@charpoints/core";

export const CharImageStore = (sql: Sql<any>) => {
  const filter = async (): Promise<CharImage[] | Error> => {
    return [];
  };

  const insert = async (payload: CharImage): Promise<void | Error> => {};

  return {
    filter,
    insert,
  };
};
