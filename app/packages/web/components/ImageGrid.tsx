import React from "react";
import { CharImage } from "@charpoints/core";
import Image from "./Image";

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
        <div key={x.id} style={{ padding: "0.5em" }}>
          <Image key={x.id} charImage={x} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
