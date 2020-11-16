import React from "react";
import MainPage from "./MainPage";
import store from "../store";
import { CharImage } from "../store";
import ImageData from "../data/imageData.txt";
import { range } from "lodash";

const { data, loading } = store;
let charImages = data.state.charImages;
range(10).forEach(() => {
  const charImage = {
    ...CharImage(),
    data: ImageData,
  };
  charImages = charImages.set(charImage.id, charImage);
  data.state.charImages = charImages;
});
loading.state.isActive = true;

export default {
  title: "pages/MainPage",
  component: MainPage,
};

export const Primary = () => <MainPage />;
