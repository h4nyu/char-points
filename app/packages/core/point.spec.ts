import { Point } from "@charpoints/core/point";
import { ErrorKind } from "@charpoints/core/error";

describe("poing", () => {
  test("valid", () => {
    const point = Point({
      x: 0.1,
      y: 0.1,
    })
    const err = point.validate();
    if (err instanceof Error) {
      throw err;
    }
  });

  test("invalidRange", () => {
    const point = Point({
      x: 10,
      y: 0.2
    })
    let err = point.validate()
    expect(err instanceof Error).toBe(true)
    if (err instanceof Error) {
      expect(err.message).toBe(ErrorKind.PointOutOfRange)
    }
  })
});
