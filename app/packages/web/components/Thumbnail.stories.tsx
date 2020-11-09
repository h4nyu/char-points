import React from "react";
import Thumbnail from "./Thumbnail";
import { action } from "@storybook/addon-actions";
import { defaultCharImage } from "@charpoints/core/charImage";
import ImageData from "../data/imageData.txt";

export default {
  title: "Thumbnail",
  component: Thumbnail,
};

const charImage = defaultCharImage();
charImage.data = ImageData;
export const Primary = () => <Thumbnail charImage={charImage} />;
