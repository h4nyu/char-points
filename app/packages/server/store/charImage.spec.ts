import { Store } from ".";
import fs from "fs";
import { CharImage, PointType } from "@charpoints/core/charImage";
const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("ChartImage", () => {
  const store = rootStore.charImage;
  const row = {
    ...CharImage(),
  };
  beforeAll(async () => {
    await store.clear();
    const buffer = await fs.promises.readFile("/srv/package.json");
    row.data = buffer.toString("base64");
    row.points = [
      {
        x: 2,
        y: 3,
        pointType: PointType.Start,
      },
    ];
  });
  test("insert", async () => {
    const err = await store.insert(row);
    if (err instanceof Error) {
      throw err;
    }
    const res = await store.find({ id: row.id });
    if (res instanceof Error) {
      throw res;
    }
    expect(res).toEqual(row);
  });
  test("filter", async () => {
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toMatchObject([
      { ...row, data: undefined, points: undefined },
    ]);
  });
  test("delete", async () => {
    const err = await store.delete({ id: row.id });
    if (err instanceof Error) {
      throw err;
    }
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toEqual([]);
  });
});
