import { Point } from "@charpoints/core/point";
import { ErrorKind } from "@charpoints/core/error";

describe("poing", () => {
  test("valid", () => {
    const box = {
      ...Point(),
      x: 0.1,
      y: 0.1,
    };
    const err = box.validate();
    if (err instanceof Error) {
      throw err;
    }
  });

  // test("invalidRange", () => {
  //   const box = {
  //     ...Point(),
  //     x0: 10,
  //     y1: 0.2
  //   }
  //   let err = box.validate()
  //   expect(err instanceof Error).toBe(true)
  //   if (err instanceof Error) {
  //     expect(err.message).toBe(ErrorKind.PointOutOfRange)
  //   }
  // })
});
