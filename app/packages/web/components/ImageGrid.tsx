import React from "react";
import { CharImages } from "../store";
import { Set } from "immutable";
import Thumbnail from "./Thumbnail";

export const ImageGrid = (props: {
  charImages: CharImages;
  selectedIds?: Set<string>;
  onClick?: (id: string) => void;
}) => {
  const { charImages, selectedIds, onClick } = props;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "auto",
      }}
    >
      {charImages.toList().map((x) => (
        <Thumbnail
          key={x.id}
          charImage={x}
          isSelected={selectedIds?.has(x.id)}
          onClick={() => onClick && onClick(x.id)}
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
