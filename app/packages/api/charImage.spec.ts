import { RootApi } from "."

const rootApi = RootApi()
describe("charImage",() => {
  const api = rootApi.charImage
  test("create", async () => {
  })
  test("filter", async () => {
    const rows = await api.filter({})
    if(rows instanceof Error){throw rows}
  })
})
