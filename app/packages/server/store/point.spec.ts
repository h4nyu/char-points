import Store from ".";
import CharPoint from "@charpoints/core/CharPoint";
import { PointType, Point } from "@charpoints/core/point";

const store = Store({
  url: process.env.DATABASE_URL || "",
});

afterAll(async () => {
  await store.close();
});

describe("charpoint", () => {
  const repo = store.point;
  beforeAll(async () => {
    const err = await repo.clear();
    if (err instanceof Error) {
      throw err;
    }
  });
  const imageId = "aaaa";
  const points = [Point(), Point(), Point(), Point()].map((p) => {
    return {
      ...p,
      imageId,
    };
  });
  test("insert", async () => {
    const err = await repo.insert(points);
    if (err instanceof Error) {
      throw err;
    }
    const res = await repo.filter({ imageId });
    if (res instanceof Error) {
      throw res;
    }
    expect(res).toEqual(points);
  });
  test("delete", async () => {
    const err = await repo.delete({ imageId });
    if (err instanceof Error) {
      throw err;
    }
    const res = await repo.filter({ imageId });
    if (res instanceof Error) {
      throw res;
    }
    expect(res).toEqual([]);
  });
});
