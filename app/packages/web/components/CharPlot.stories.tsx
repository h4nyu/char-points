import React from "react";
import CharPlot from "./CharPlot";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { fromLabelMe } from "@charpoints/core/charImage";
import labelMeData from "/srv/data/annto.json";
import annot from "/srv/data/annto.json";

export default {
  title: "CharPlot",
  component: CharPlot,
};

const [image, points] = fromLabelMe(labelMeData);
export const Basic = (args) => (
  <CharPlot {...args} image={image} points={points} />
);
