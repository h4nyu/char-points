import axios from "axios";
import { UserApi } from "./index";
import { v4 } from "uuid";
import { range } from "lodash";

function now () {
  var ts = process.hrtime()
  console.log(ts)
  return (ts[0] * 1e3) + (ts[1] / 1e6)
}

describe("user", () => {
  const httpClient = axios.create({ baseURL: "http://app:80" });
  const api = UserApi(httpClient);
  test("insert and fetch", async () => {
    let start = now()  // in ms
    const count = 500
    await Promise.all(range(count).map(() => api.create({ name: v4() })));
    console.log((now() - start)/count)
  });
});
