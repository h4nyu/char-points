import React from "react";
import { State } from "@charpoints/core/charImage";

export const Tag = (props: { 
  value: "Point" | "Box" | State ,
  isChecked?: boolean
}) => {
  const { value } = props;
  if (value === "Point") {
    return <span className="tag is-light is-info">{value}</span>;
  }
  if (value === "Box") {
    return <span className="tag is-light is-success">{value}</span>;
  }
  if (value === State.Todo) {
    return <span className="tag is-light is-warning">{value}</span>;
  }
  if (value === State.Done) {
    return <span className="tag is-light is-info">{value}</span>;
  }
  return null;
};
export default Tag;
