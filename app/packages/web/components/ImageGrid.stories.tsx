import React from "react";
import ImageGrid from "./ImageGrid";
import { action } from "@storybook/addon-actions";
import { defaultCharImage } from "@charpoints/core/charImage"

export default {
  title: "ImageGrid",
  component: ImageGrid,
};

const charImages = [
  defaultCharImage(),
  defaultCharImage(),
]
export const Primary = () => <ImageGrid charImages={charImages} />;
