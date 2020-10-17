import Store from ".";

const store = Store({
  url: process.env.DATABASE_URL || "",
});

afterAll(async () => {
  await store.close();
});

describe("charpoint", () => {
  //TODO
});
