import React from "react";
import Component from "./SvgCharPlot";
import store from "../store";
import { Image, Box, Point } from "../store";
import { Map } from "immutable";
import annot from "/srv/data/annto.json";

const { imageData } = annot;

export default {
  title: "SvgCharPlot",
  component: Component,
};
const boxes = Map(
  [{ ...Box(), x0: 0.1, y0: 0.1, x1: 0.2, y1: 0.2 }].map((x, i) => [`${i}`, x])
);

const points = Map([{ ...Point(), x: 0.3, y: 0.2 }].map((x, i) => [`${i}`, x]));

export const Primary = (args) => (
  <Component {...args} data={imageData} points={points} />
);
export const Large = (args) => (
  <Component
    {...args}
    data={imageData}
    size={512}
    points={points}
    boxes={boxes}
  />
);
