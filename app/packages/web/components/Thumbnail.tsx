import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core/charImage";

const CheckIcon = () => (
  <i
    style={{ position: "absolute", top: 0, left: 0 }}
    className="fas fa-check-circle"
  />
);
export const ImagePreview = (props: {
  charImage: CharImage;
  style?: CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const { charImage, style, onClick, isSelected } = props;
  const backgroundColor = (isSelected && "has-background-primary") || "";
  return (
    <div className={`card p-2 m-1`} onClick={onClick}>
      <figure
        className="image is-16x16"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`data:image;base64,${charImage.data}`}
          style={{ width: "auto", maxHeight: "100%" }}
        />
      </figure>
      {isSelected && <CheckIcon />}
    </div>
  );
};
export default ImagePreview;
