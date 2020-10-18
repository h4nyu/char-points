import Store from ".";
import CharPoint from "@charpoints/core/CharPoint";
import { PointType } from "@charpoints/core";

const store = Store({
  url: process.env.DATABASE_URL || "",
});

afterAll(async () => {
  await store.close();
});

describe("charpoint", () => {
  const repo = store.charPoint;
  beforeEach(async () => {
    await repo.clear();
  });
  test("insert and find", async () => {
    const row = CharPoint().unwrap();
    await repo.create(row);
    let res = await repo.find({ id: row.id });
    expect(res).toStrictEqual(row);
    row.pointType = PointType.Stop;
    await repo.update(row);
    res = await repo.find({ id: row.id });
    expect(res).toStrictEqual(row);
  });
});
