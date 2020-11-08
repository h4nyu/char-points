import { Store } from ".";
import fs from "fs";
import { defaultCharImage } from "@charpoints/core/charImage";
const rootStore = Store({ url: process.env.DATABASE_URL || "" });

afterAll(async () => {
  await rootStore.close();
});

describe("ChartImage", () => {
  const store = rootStore.charImage;
  const row = {
    ...defaultCharImage(),
  };
  beforeAll(async () => {
    await store.clear();
    const buffer = await fs.promises.readFile("/srv/package.json");
    row.data = buffer.toString("base64")
  });
  test("insert", async () => {
    const err = await store.insert(row);
    if (err instanceof Error) {
      throw err;
    }
  });
  test("filter", async () => {
    const rows = await store.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows).toEqual([row]);
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
