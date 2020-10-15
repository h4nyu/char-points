import db from "./database";
import { defaultUser } from "x-core/user";

beforeEach(async () => {
  const { clearUsers } = db;
  await clearUsers();
});

afterAll(async () => {
  await db.close();
});

describe("user", () => {
  test("insert and fetch", async () => {
    const { insertUser, fetchUsers } = db;
    const user = defaultUser();
    await insertUser(user);
    const users = await fetchUsers();
    expect(users.length).toBe(1);
  });

  test("insert and update", async () => {
    const { insertUser, fetchUser, updateUser } = db;
    const savedUser = defaultUser();
    savedUser.name = "aaa";
    await insertUser(savedUser);
    savedUser.name = "bbb";
    await updateUser(savedUser);
    let updatedUser = await fetchUser({ name: "aaa" });
    expect(updatedUser).toBe(undefined);
    updatedUser = await fetchUser({ name: "bbb" });
    expect(updatedUser?.name).toBe("bbb");
  });
});
