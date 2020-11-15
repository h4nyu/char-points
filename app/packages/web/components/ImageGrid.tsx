import React from "react";
import { CharImages } from "../store";
import Thumbnail from "./Thumbnail";

export const ImageGrid = (props: { charImages: CharImages }) => {
  const { charImages } = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "auto",
        height: "100%"
      }}
    >
      {charImages.toList().map((x) => (
        <Thumbnail
          key={x.id}
          charImage={x}
          style={{
            height: 100,
            width: 100,
            margin: "0.1em",
          }}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
