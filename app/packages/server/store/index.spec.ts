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
  test("create,update,find,delete", async () => {
    const row = CharPoint().unwrap();
    await repo.insert(row);
    let res = await repo.find({ id: row.id });
    expect(res).toStrictEqual(row);
    row.pointType = PointType.Stop;
    await repo.update(row);
    res = await repo.find({ id: row.id });
    expect(res).toStrictEqual(row);
    await repo.delete({ id: row.id });
    res = await repo.find({ id: row.id });
    expect(res).toBe(undefined);
  });
  test("filter", async () => {
    await Promise.all([
      repo.insert(CharPoint().setImageId("testA").unwrap()),
      repo.insert(CharPoint().setImageId("testB").unwrap()),
      repo.insert(
        CharPoint().setImageId("testB").setPointType(PointType.Stop).unwrap()
      ),
    ]);
    let res = await repo.filter({});
    expect(res.length).toBe(3);
    res = await repo.filter({ imageId: "testA" });
    expect(res.length).toBe(1);
    res = await repo.filter({ imageId: "testB" });
    expect(res.length).toBe(2);
    res = await repo.filter({ imageId: "testB", pointType: PointType.Stop });
    expect(res.length).toBe(1);
  });
});
