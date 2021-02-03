import { RootApi } from ".";
import fs from "fs";

const rootApi = RootApi();
rootApi.setUrl("http://srv");
describe("image", () => {
  const api = rootApi.image;
  test("create and filter", async () => {
    const buffer = await fs.promises.readFile("/srv/package.json");
    const data = buffer.toString("base64");
    const name = "test_image.jpg"
    const id = await api.create({ data, name });
    if (id instanceof Error) {
      throw id;
    }
    const saved = await api.find({ id });
    if (saved instanceof Error) {
      throw saved;
    }
    console.log(saved);
    expect(saved?.data).toEqual(data);
  });
});
