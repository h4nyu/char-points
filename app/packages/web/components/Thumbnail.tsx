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
    <div
      className="card"
      style={{
        display: "flex",
        ...style,
      }}
    >
      <img
        src={`data:image;base64,${charImage.data}`}
        style={{ width: 80, height: 80 }}
      />
      {onDeleteClick && (
        <button className="button" onClick={onDeleteClick}>
          Delete
        </button>
      )}
    </div>
  );
};
export default ImagePreview;
