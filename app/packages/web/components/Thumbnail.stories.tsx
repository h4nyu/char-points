import React from "react";
import Thumbnail from "./Thumbnail";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { defaultCharImage } from "@charpoints/core/charImage";
import ImageData from "../data/imageData.txt";

const charImage = defaultCharImage();
charImage.data = ImageData;

export default {
  title: "Thumbnail",
  component: Thumbnail,
};

export const Basic = () => (
  <Thumbnail
    charImage={charImage}
    isSelected={boolean("isSelected", false)}
    onDeleteClick={action("onDeleteClick")}
  />
);
