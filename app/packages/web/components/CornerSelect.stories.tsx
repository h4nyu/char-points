import React from "react";
import Component from "./CornerSelect";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Image } from "@charpoints/core/image";
import Mock from "./Mock";
import ImageData from "../data/imageData.txt";
import annot from "/srv/data/annto.json";

const charImage = Image();
charImage.data = ImageData;

export default {
  title: "CornerSelect",
  component: Component,
};

export const Basic = (args) => <Component {...args} />;
export const WithChildren = (args) => (
  <div>
    <div>
      <Component {...args}>
        <Mock />
      </Component>
    </div>
    <div>
      <Component {...args}>
        <Mock />
      </Component>
    </div>
  </div>
);
