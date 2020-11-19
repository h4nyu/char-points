import React, { useRef, RefObject, useState } from "react";
import { CharImage } from "@charpoints/core/charImage";

export const CharPlot = (props: {
  image: CharImage;
  scale?: number;
}) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const { image } = props;
  const scale = props.scale || 1.0;
  const img = new Image();
  img.src = `data:image;base64,${image.data}`;
  img.onload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0, img.width, img.height);
    image.points?.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x * scale, p.y * scale, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  };
  return (
    <canvas ref={canvasRef} style={{ width: 128, height: 128 }} />
  );
};
export default CharPlot;
