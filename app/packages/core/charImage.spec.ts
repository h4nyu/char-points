import { fromLabelMe } from "./charImage";
import testData from "/srv/data/annto.json";

describe("fromLabelMe", () => {
  test("default", () => {
    const [image, points] = fromLabelMe(testData);
    expect(points?.length).toBe(38);
  });
});
