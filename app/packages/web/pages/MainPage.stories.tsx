import React from "react";
import MainPage from "./MainPage";
import store from "../store";
import { Image } from "../store";
import ImageData from "../data/imageData.txt";
import { range } from "lodash";

const { data, loading } = store;
let images = data.state.images;
range(10).forEach(() => {
  const image = {
    ...Image(),
    data: ImageData,
  };
  images = images.push(image);
  data.state.images = images;
});
loading.state.isActive = true;

export default {
  title: "pages/MainPage",
  component: MainPage,
};

export const Primary = () => <MainPage />;
