import { RootApi } from ".";
import fs from "fs";

const rootApi = RootApi();
rootApi.setUrl("http://srv");
describe("charImage", () => {
  const api = rootApi.charImage;
  test("create and filter", async () => {
    const data = await fs.promises.readFile("/srv/package.json");
    const id = await api.create({ data });
    if (id instanceof Error) {
      throw id;
    }
    const rows = await api.filter({});
    if (rows instanceof Error) {
      throw rows;
    }
    expect(rows.find((x) => x.id === id)?.data).toEqual(data);
  });
});
