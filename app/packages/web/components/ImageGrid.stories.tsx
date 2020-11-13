import React from "react";
import ImageGrid from "./ImageGrid";
import { action } from "@storybook/addon-actions";
import { CharImage } from "@charpoints/core/charImage";
import ImageData from "../data/imageData.txt";
import { range } from "lodash";

export default {
  title: "ImageGrid",
  component: ImageGrid,
};

const charImages = range(100).map((x) => {
  return {
    ...CharImage(),
    data: ImageData,
  };
});
export const Primary = () => (
  <ImageGrid charImages={charImages} onDeleteClick={action("onDeleteClick")} />
);
