import CharPoint from "./CharPoint";

describe("charPoint", () => {
  test("wrap", () => {
    const a = CharPoint().shift({ x: 1, y: 1 }).shift({ x: 2, y: 2 }).unwrap();
    console.log(a);
  });
});
