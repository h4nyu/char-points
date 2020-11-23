import React from "react";
import Component from "./PointList";
import { Point } from "../store";

export default {
  title: "PointList",
  component: Component,
};
const points = [Point(), Point()];

export const Primary = (args) => (
  <>
    <Component {...args} points={points} />
  </>
);
