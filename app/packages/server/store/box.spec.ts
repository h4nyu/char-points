import { Store } from ".";
import fs from "fs";
import { Box } from "@charpoints/core/box";

const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("box", () => {
  const store = rootStore.box;
  const row = { ...Box(), imageId: "aaa", isGrandTruth:true };

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
  test("delete-imageId", async () => {
    const err = await store.delete({ imageId: row.imageId });
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
