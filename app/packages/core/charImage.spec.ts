import { fromLabelMe } from "./charImage";
import testData from "/srv/data/annto.json";

describe("fromLabelMe", () => {
  test("default", () => {
    const res = fromLabelMe(testData);
    expect(res.points?.length).toBe(38);
  });
});
