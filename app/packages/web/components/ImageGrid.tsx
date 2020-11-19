import React from "react";
import { CharImages } from "../store";
import { Set } from "immutable";
import Thumbnail from "./Thumbnail";
import CharPlot from "./CharPlot";

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
          <CharPlot
            key={x.id}
            image={x}
          />
      ))}
    </div>
  );
};

export default ImageGrid;
