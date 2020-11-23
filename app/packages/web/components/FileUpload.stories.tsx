import React from "react";
import FileUpload from "./FileUpload";
import { action } from "@storybook/addon-actions";

export default {
  title: "FileUpload",
  component: FileUpload,
};

export const ImageUpload = (args) => <FileUpload {...args} accept="image/*" />;
export const JsonUpload = (args) => (
  <FileUpload {...args} accept="application/json" />
);
