import { Lock } from "./lock";
import { range } from "lodash";

const lock = Lock({ dir: "/tmp" });

describe("lock", () => {
  test("lock", async () => {
    let resorceA = 0;
    let resorceB = 0;
    const proc = async () => {
      await lock.withLock(async () => {
        resorceA += 1;
        await new Promise((r) => setTimeout(r, 50));
        resorceB += resorceA;
      });
    };
    await Promise.all(range(10).map(proc));
    expect(resorceA).toBe(10);
    expect(resorceB).toBe(55);
  });
});
