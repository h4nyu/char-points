import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core/charImage";

export const ImagePreview = (props: {
  charImage: CharImage;
  style?: CSSProperties;
  isSelected?: boolean;
  onDeleteClick?: () => void;
}) => {
  const { charImage, style, onDeleteClick } = props;
  return (
    <figure className="image is-128x128">
      <img
        src={`data:image;base64,${charImage.data}`}
        style={{ width: 128, height: 128 }}
      />
    </figure>
  );
};
export default ImagePreview;
