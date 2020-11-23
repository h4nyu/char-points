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

const charImage = fromLabelMe(labelMeData);
charImage.points = [];
const { editCharImage, data } = store;
data.state.charImages = data.state.charImages.set(charImage.id, charImage);
export const Primary = (args) => <Page {...args} id={charImage.id}/>;
