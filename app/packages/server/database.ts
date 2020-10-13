import postgres, { Row } from "postgres";
import { User } from "./domain";
import { first } from "lodash";

function toUser(r: Row): User {
  return {
    id: r.id,
    name: r.name,
  };
}

export const Store = () => {
  const sql = postgres("postgres://app:app@db/app", { max: 5 });
  const close = async () => {
    await sql.end({ timeout: 5 });
  };

  const fetchUser = async (payload: {
    name?: string;
    id?: string;
  }): Promise<User | undefined> => {
    const { name, id } = payload;
    let rows: Row[] = [];
    if (name && id) {
      rows = await sql`SELECT * FROM users WHERE name = ${name} AND id = ${id} LIMIT 1`;
    } else if (name) {
      rows = await sql`SELECT * FROM users WHERE name = ${name} LIMIT 1`;
    }
    return first(rows.map(toUser));
  };

  const fetchUsers = async (): Promise<User[]> => {
    const rows = await sql`SELECT * FROM users`;
    return rows.map(toUser);
  };

  const insertUser = async (user: User) => {
    await sql`INSERT INTO  users ${sql(user, "name", "id")}`;
  };

  const updateUser = async (user: User) => {
    await sql`UPDATE users SET ${sql(user, "name")} WHERE id = ${user.id}`;
  };
  const clearUsers = async () => {
    await sql`TRUNCATE users`;
  };
  return {
    fetchUser,
    fetchUsers,
    insertUser,
    clearUsers,
    updateUser,
    close,
  };
};
export default Store();
