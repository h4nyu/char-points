import React from "react";
import Page from "./EditCharImagePage";
import store from "../store";

export default {
  title: "pages/EditChartImagePage",
  component: Page,
};

const { editor, data } = store;
editor.state.id = "aaaaa";
export const Primary = (args) => <Page />;
