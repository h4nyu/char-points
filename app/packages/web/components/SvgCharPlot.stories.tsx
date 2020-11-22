import React from "react";
import Component from "./SvgCharPlot";
import store from "../store";
import { CharImage } from "../store";
import { fromLabelMe } from "@charpoints/core/charImage";
import annot from "/srv/data/annto.json";

const charImage = fromLabelMe(annot);

export default {
  title: "SvgCharPlot",
  component: Component,
};

export const Primary = (args) => <Component {...args} data={charImage.data} points={charImage.points}/>;
export const Large = (args) => <Component {...args} data={charImage.data} size={512} points={charImage.points}/>;
