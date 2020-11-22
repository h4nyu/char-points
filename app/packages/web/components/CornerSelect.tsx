import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core/charImage";

const CheckIcon = () => (
  <i
    style={{ position: "absolute", top: 0, left: 0 }}
    className="fas fa-check-circle"
  />
);

export const Select: React.FC<{
  isSelected?: boolean;
}> = (props) => {
  return (
    <div style={{ position: "relative" }}>
      {props.children}
      {props.isSelected && <CheckIcon />}
    </div>
  );
};
export default Select;
