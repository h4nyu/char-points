import sharp from "sharp";
import { CropFn } from '@charpoints/core/transform'

export const crop:CropFn = async ({imageData, box}) => {
  try{
    const width = box.x1 - box.x0
    const height = box.y1 - box.y0
    const buf = await sharp(Buffer.from(imageData, "base64"))
      .extract({ width, height, left: box.x0, top: box.y0 })
      .resize(width, height)
      .toBuffer();
    return buf.toString("base64")
  }catch(e){
    return e
  }
}
