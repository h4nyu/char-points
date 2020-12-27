import { Store } from ".";
import fs from "fs";
import { Image, State } from "@charpoints/core/image";
const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("image", () => {
  const store = rootStore.image;
  const row = {
    ...Image(),
    hasPoint: true,
    hasBox: true,
  };
  beforeAll(async () => {
    await store.clear();
    const buffer = await fs.promises.readFile("/srv/package.json");
    row.data = buffer.toString("base64");
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
  test("update", async () => {
    row.data = Buffer.from("aaaaa").toString("base64");
    row.state = State.Done;
    row.weight = 1000.0;
    const err = await store.update(row);
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
    expect(rows).toMatchObject([{ ...row, data: undefined }]);
  });
  test("filter-hasBox", async () => {
    const rows = await store.filter({ hasBox: true });
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toMatchObject([{ ...row, data: undefined }]);
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
