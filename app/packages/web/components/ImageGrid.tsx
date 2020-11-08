import React from "react";
import { CharImage } from "@charpoints/core";

export const ImageGrid = (props:{
  charImages: CharImage[]
}) => {
  const { charImages } = props;
  return <>
    {
      charImages.map(x => <div key={x.id}>{x.id}</div>)
    }
  </>
}

export default ImageGrid;
