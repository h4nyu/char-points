import React, { useRef, RefObject, useState, useEffect } from "react";
import { CharImage } from "@charpoints/core/charImage";

export const CharPlot = (props: {
  image: CharImage;
  size?: number;
  onClick?: (pos: { x: number; y: number }) => void;
}) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const { image, onClick } = props;
  const position = { x: 0, y: 0 };
  let scale = 1.0;
  const size = props.size || 128;

  const handleClick = (e) => {
    if (onClick === undefined) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const { left, top } = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - left;
    const y = clientY - top;
    onClick({
      x,
      y,
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.beginPath();
    ctx.arc(x, y, 1 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  };

  const handleDrag = (e) => {
    console.log(e);
  };

  useEffect(() => {
    const img = new Image();
    img.src = `data:image;base64,${image.data}`;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const maxLength = Math.max(img.width, img.height);
      scale = size / maxLength;
      const height = img.height * scale;
      const width = img.width * scale;
      canvas.height = height;
      canvas.width = width;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      image.points?.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, 1 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    };
  }, [size]);
  return (
    <div
      className="card p-1 m-1 is-focused"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onDrag={handleDrag}
        draggable
      />
    </div>
  );
};
export default CharPlot;
