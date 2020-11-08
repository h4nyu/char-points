import React from "react";
import Image from "./Image";
import { action } from "@storybook/addon-actions";
import { defaultCharImage } from "@charpoints/core/charImage"
import ImageData from "../data/imageData.txt";
console.log(ImageData)


export default {
  title: "Image",
  component: Image,
};

const charImage = defaultCharImage()
charImage.data  = ImageData
export const Primary = () => <Image charImage={charImage} />;
