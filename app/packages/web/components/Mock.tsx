import React, { CSSProperties } from "react";

const Component = (props: { name?: string; style?: CSSProperties }) => {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  return (
    <div
      className="card"
      style={{
        backgroundColor: `#${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...props.style,
      }}
    >
      {props.name ? props.name : "Mock Component"}
    </div>
  );
};

export default Component;
