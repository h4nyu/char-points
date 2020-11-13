import React from "react";
import { CharImages } from "../store"
import Thumbnail from "./Thumbnail";

export const ImageGrid = (props: {
  charImages: CharImages;
  onDeleteClick: (id: string) => void;
}) => {
  const { charImages, onDeleteClick } = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
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
          onDeleteClick={() => onDeleteClick(x.id)}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
