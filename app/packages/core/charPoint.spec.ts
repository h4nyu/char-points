import * as point from "./charPoint";

describe("charPoint", () => {
  test("wrap", () => {
    const a = point
      .wrap(point.default())
      .shift({ x: 1, y: 1 })
      .shift({ x: 2, y: 2 })
      .unwrap();
    console.log(a);
  });
});
