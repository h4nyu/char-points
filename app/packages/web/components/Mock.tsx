import React, { CSSProperties } from "react";

const Component = (props: { name?: string; style?: CSSProperties }) => {
  return (
    <div className="card" style={props.style}>
      {props.name ? props.name : "Mock Component"}
    </div>
  );
};

export default Component;
