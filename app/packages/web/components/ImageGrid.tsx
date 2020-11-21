import React from "react";
import { CharImages } from "../store";
import { Set } from "immutable";
import CharPlot from "./CharPlot";
import CornerSelect from "./CornerSelect";

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
      {charImages
        .toList()
        .sortBy(x => - x.points?.length)
        .map((x) => (
        <div 
          key={x.id}
          onClick={() => onClick && onClick(x.id)}
        >
          <CornerSelect
            isSelected={selectedIds?.includes(x.id)}
          >
            <CharPlot
              image={x}
            />
          </CornerSelect>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
