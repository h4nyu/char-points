import React from "react";
import Annto from "./Annto";
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import ImageData from "../data/imageData.txt";
import annot from "/srv/data/annto.json";

export default {
  title: "Annto",
  component: Annto,
};

export const Basic = (args) => <Annto {...args} data={annot} />;
