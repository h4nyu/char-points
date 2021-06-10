import sharp from "sharp";
import { CropFn } from '@charpoints/core/transform'
import { floor } from "lodash";

export const crop:CropFn = async ({imageData, box}) => {
  try{
    const x0 = floor(box.x0)
    const x1 = floor(box.x1)
    const y0 = floor(box.y0)
    const y1 = floor(box.y1)
    const width = x1 - x0
    const height = y1 - y0
    const buf = await sharp(Buffer.from(imageData, "base64"))
      .extract({ width, height, left: x0, top: y0 })
      .resize(width, height)
      .toBuffer();
    return buf.toString("base64")
  }catch(e){
    return e
  }
}
