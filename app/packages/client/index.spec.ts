import axios from "axios";
import { UserApi } from "./index";

describe("user", () => {
  const httpClient = axios.create({ baseURL: "http://app:80" });
  const api = UserApi(httpClient);
  test("insert and fetch", async () => {
    try {
      await api.create({ name: "aa" });
    } catch (e) {
      console.log(e);
    }
  });
});
