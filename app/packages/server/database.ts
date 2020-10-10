import postgres, { Row } from "postgres";
import { User } from "./domain";

function toUser(r: Row): User {
  return {
    id: r.id,
    name: r.name,
  };
}

export const getStore = () => {
  const sql = postgres("postgres://app:app@db/app");
  const close = async () => {
    await sql.end({ timeout: 5 });
  };
  const fetchUsers = async (): Promise<User[]> => {
    const users = await sql`SELECT * FROM users`.stream(toUser);
    return users;
  };
  return {
    fetchUsers,
    close,
  };
};
export default getStore();
