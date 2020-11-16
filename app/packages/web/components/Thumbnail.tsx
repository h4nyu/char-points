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
    <div className={`card p-2 m-1 ${backgroundColor}`} onClick={onClick}>
      <figure className="image is-128x128">
        <img
          src={`data:image;base64,${charImage.data}`}
          style={{ width: 128, height: 128 }}
        />
      </figure>
    </div>
  );
};
export default ImagePreview;
