import React from "react";
import FileUpload from "./FileUpload";
import { action } from "@storybook/addon-actions";

export default {
  title: "FileUpload",
};

export const Primary = () => <FileUpload onChange={action("onChange")} />;
