import React, { useRef, RefObject, useState, useEffect } from "react";
import { CharImage } from "@charpoints/core/charImage";

export const CharPlot = (props: {
  image: CharImage;
}) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const { image } = props;
  const img = new Image();
  useEffect(() => {
    img.src = `data:image;base64,${image.data}`;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const maxLength = Math.max(img.width, img.height);
      const scale = 128 / maxLength 
      const height = img.height * scale
      const width = img.width * scale;
      canvas.height = height
      canvas.width = width
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      image.points?.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * scale , p.y * scale, 1 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    };
  }, [])
  return (
    <div className="card p-1 m-1 is-focused">
      <figure 
        className="image is-128x128" 
        style={{
          display: "flex", 
          justifyContent: "center"
        }}
      >
        <canvas ref={canvasRef} />
      </figure>
    </div>
  );
};
export default CharPlot;
