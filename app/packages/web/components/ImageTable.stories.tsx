import React from "react";
import ImageTable from "./ImageTable";
import { Image } from "@charpoints/core/image";

export default {
  title: "ImageTable",
  component: ImageTable,
};

const images = [Image({
  id: "imageId",
  name: "imageName",
  createdAt: new Date(),
})];
export const Primary = (args) => <ImageTable {...args} images={images} />;
