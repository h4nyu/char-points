import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

export const ImagePreview = (props: {
  charImage: CharImage;
  style?: CSSProperties;
  onDeleteClick?: () => void;
}) => {
  const { charImage, style, onDeleteClick } = props;
  return (
    <Card
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
        <IconButton aria-label="delete" onClick={onDeleteClick}>
          <DeleteIcon />
        </IconButton>
      )}
    </Card>
  );
};
export default ImagePreview;
