import React, { useRef, RefObject, CSSProperties } from "react";
import { CharImage } from "@charpoints/core/charImage";

const CheckIcon = () => (
  <i
    style={{ position: "absolute", top: 0, left: 0 }}
    className="fas fa-check-circle"
  />
);
export const ImagePreview = (props: { data: any }) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);

  const { data } = props;
  const image = new Image();
  image.src = `data:image;base64,${data.imageData}`;
  image.onload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(image, 0, 0);
    data.shapes.forEach((s) => {
      if (!s.points) {
        return;
      }
      const [x, y] = s.points[0];
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
    });
  };

  return (
    <canvas ref={canvasRef} style={{ width: "auto", maxHeight: "100%" }} />
  );
};
export default ImagePreview;
