import React, { useRef, RefObject } from "react";
import { CharImage } from "@charpoints/core/charImage";
import { Point } from "@charpoints/core/point";

export const CharPlot = (props: {
  image: CharImage;
  points: Point[];
  scale?: number;
}) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const { points } = props;
  const scale = props.scale || 2.0;
  const image = new Image();
  image.src = `data:image;base64,${props.image.data}`;
  image.onload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x * scale, p.y * scale, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  };
  return (
    <canvas ref={canvasRef} style={{ width: "auto", maxHeight: "100%" }} />
  );
};
export default CharPlot;
