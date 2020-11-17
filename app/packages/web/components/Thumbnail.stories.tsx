import React from "react";
import Thumbnail from "./Thumbnail";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { CharImage } from "@charpoints/core/charImage";
import ImageData from "../data/imageData.txt";
import annot from "/srv/data/annto.json";

const charImage = CharImage();
charImage.data = ImageData;

export default {
  title: "Thumbnail",
  component: Thumbnail,
};

export const Basic = (args) => <Thumbnail {...args} charImage={charImage} />;
