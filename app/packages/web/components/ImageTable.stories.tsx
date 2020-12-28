import React from "react";
import ImageTable from "./ImageTable";
import { Image } from "@charpoints/core/image";

export default {
  title: "ImageTable",
  component: ImageTable,
};

const images = [
  {...Image()}
]
export const Primary = (args) => <ImageTable {...args} images={images} />;

