import { Lock } from "./lock";
import { range } from "lodash";

const lock = Lock({ dir: "/tmp" });

afterAll(() => {
  lock.close();
});

describe("lock", () => {
  test("lock", async () => {
    let resorceA = 0;
    let resorceB = 0;
    const proc = async (name: number) => {
      await lock.lock();
      resorceA += 1;
      await new Promise((r) => setTimeout(r, 50));
      resorceB += resorceA;
      await lock.unlock();
    };
    await Promise.all(range(10).map(proc));
    expect(resorceA).toBe(10)
    expect(resorceB).toBe(55)
    lock.close();
  });
});
