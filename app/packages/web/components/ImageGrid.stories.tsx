import React from "react";
import ImageGrid from "./ImageGrid";
import { action } from "@storybook/addon-actions";
import { Map } from "immutable"
import { CharImages, CharImage } from "../store"
import ImageData from "../data/imageData.txt";
import { range } from "lodash";

export default {
  title: "ImageGrid",
  component: ImageGrid,
};
let charImages:CharImages = Map()
range(100).map((x) => {
  const row = {
    ...CharImage(),
    data: ImageData,
  };
  charImages = charImages.set(row.id, row)
});
export const Primary = () => (
  <ImageGrid charImages={charImages} onDeleteClick={action("onDeleteClick")} />
);
