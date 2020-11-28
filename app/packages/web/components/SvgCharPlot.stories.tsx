import React from "react";
import Component from "./SvgCharPlot";
import store from "../store";
import { CharImage, Box } from "../store";
import { fromLabelMe } from "@charpoints/core/charImage";
import annot from "/srv/data/annto.json";

const [charImage, points] = fromLabelMe(annot);

export default {
  title: "SvgCharPlot",
  component: Component,
};
const boxes = [
  {...Box(), x0:0.1, y0:0.1, x1:0.2, y1:0.2}
]

export const Primary = (args) => (
  <Component {...args} data={charImage.data} points={points} />
);
export const Large = (args) => (
  <Component
    {...args}
    data={charImage.data}
    size={512}
    points={points}
    boxes={boxes}
  />
);
