import React from "react";
import { CharImage } from "@charpoints/core";
import Thumbnail from "./Thumbnail";

export const ImageGrid = (props: { charImages: CharImage[] }) => {
  const { charImages } = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {charImages.map((x) => (
        <Thumbnail 
          key={x.id} charImage={x} 
          style={{
            height:100,
            width:100,
            margin: "0.1em"
          }}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
