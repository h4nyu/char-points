import React from "react";
import Page from "./EditCharImagePage";
import store from "../store";
import { CharImage, Point } from "../store";
import { fromLabelMe } from "@charpoints/core/charImage";
import ImageData from "../data/imageData.txt";
import labelMeData from "/srv/data/annto.json";

export default {
  title: "pages/EditChartImagePage",
  component: Page,
};

const [charImage, points] = fromLabelMe(labelMeData);
const { editor, data } = store;
data.state.images = data.state.images.push(charImage);
editor.init(charImage.id);
export const Primary = (args) => <Page />;
