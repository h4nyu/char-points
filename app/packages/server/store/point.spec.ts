import { Store } from ".";
import fs from "fs";
import { Point } from "@charpoints/core/point";

const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("point", () => {
  const store = rootStore.point;
  const row = { ...Point(), imageId: "aaa", isGrandTruth: false, confidence: 0.1 };

  beforeAll(async () => {
    await store.clear();
  });
  test("load", async () => {
    const err = await store.load([row]);
    if (err instanceof Error) {
      throw err;
    }
    const res = await store.filter({ imageId: row.imageId });
    if (res instanceof Error) {
      throw res;
    }
    expect(res).toEqual([row]);
  });
  test("filter", async () => {
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toMatchObject([row]);
  });
  test("delete", async () => {
    const err = await store.delete({ imageId: row.imageId, isGrandTruth:row.isGrandTruth });
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
