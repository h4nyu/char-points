import React from "react";

export const Tag = (props: { value: "Point" | "Box" }) => {
  const { value } = props;
  if (value === "Point") {
    return <span className="tag is-light is-info">{value}</span>;
  }
  if (value === "Box") {
    return <span className="tag is-light is-success">{value}</span>;
  }
  return null;
};
export default Tag;
