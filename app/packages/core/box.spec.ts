import { Box } from "@charpoints/core/box";
import { ErrorKind } from "@charpoints/core/error";

describe("box/validate", () => {
  test("valid", () => {
    const box = {
      ...Box(),
      x0: 0.1,
      y0: 0.1,
      x1: 0.2,
      y1: 0.2,
    };
    const err = box.validate();
    if (err instanceof Error) {
      throw err;
    }
  });

  test("invalidRange", () => {
    const box = {
      ...Box(),
      x0: 10,
      x1: 12,
      y1: 0.2,
    };
    const err = box.validate();
    expect(err instanceof Error).toBe(true);
    if (err instanceof Error) {
      expect(err.message).toBe(ErrorKind.BoxOutOfRange);
    }
  });

  test("invalidSize", () => {
    const box = {
      ...Box(),
      x0: 0.1,
      x1: 0.1,
    };
    const err = box.validate();
    expect(err instanceof Error).toBe(true);
    if (err instanceof Error) {
      expect(err.message).toBe(ErrorKind.ZeroSizeBox);
    }
  });
});
