import React from "react";
import { Toast } from "./Toast";
import { Level } from "../store"


export default {
  title: "Toast",
  component: Toast,
  argTypes: {
    level: {
      control: {
        type: "select",
        options:[
          Level.Info,
          Level.Warning,
        ]
      }
    }
  }
};

export const Primary = (args) => <>
  <Toast {...args} />
</>;

