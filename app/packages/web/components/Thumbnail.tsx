import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';

export const ImagePreview = (props: { 
  charImage: CharImage,
  style?:CSSProperties
}) => {
  const { charImage, style } = props;
  return (
    <Card style={{
      display:"flex",
      justifyContent: "center",
      alignItems:"center",
      ...style, 
      }} >
      <img 
        src={`data:image;base64,${charImage.data}`} 
        style={{width:80, height:80}}
      />
    </Card>
  )
};
export default ImagePreview;
