import RootApi from ".";
import fs from "fs";
import imageMock from "../../data/image.json"

const rootApi = RootApi();
rootApi.setUrl("http://srv");
describe("image", () => {
  const api = rootApi.transform;
  test("crop", async () => {
    const imageData = imageMock.data
    const res = await api.crop({ imageData, box:{
      x0: 10,
      y0: 10,
      y1: 20,
      x1: 20,
    }});
    if(res instanceof Error){
      throw res
    }
  });
});
