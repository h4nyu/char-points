import React from "react";
import CharPlot from "./CharPlot";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Image } from "@charpoints/core/image";
import annot from "/srv/data/annto.json";

export default {
  title: "CharPlot",
  component: CharPlot,
};

const image = {
  ...Image(),
  data: annot.imageData,
};
export const Basic = (args) => <CharPlot {...args} image={image} />;

export const Large = (args) => <CharPlot {...args} image={image} size={512} />;
