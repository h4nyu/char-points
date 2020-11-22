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
charImage.points = [{...Point()}]
const {editCharImage} = store
editCharImage.init(charImage) 
export const Primary = () => <Page />;
