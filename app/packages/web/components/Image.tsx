import React, {useRef, RefObject} from "react";
import { CharImage } from "@charpoints/core";

export const ImagePreview = (props:{
  charImage: CharImage
}) => {
  const { charImage } = props;
  const canvasRef:RefObject<HTMLCanvasElement> = useRef(null);
  const image = new Image();
  return <img id={charImage.id} src={`data:image/png;base64,${charImage.data}`}/ >
}
export default ImagePreview;
