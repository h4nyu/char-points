import db from "./database";
describe("calculate", () => {
  test("add", async () => {
    const { fetchUsers } = db;
    await fetchUsers();
  });
});

afterAll(async () => {
  await db.close();
});
