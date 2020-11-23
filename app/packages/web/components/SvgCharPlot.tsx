import React, { RefObject, useRef, useEffect, useState } from "react";
import { CharImage, Point } from "@charpoints/core/charImage";

export const SvgCharPlot = (props: {
  data?: string;
  points?: Point[];
  size?: number;
  selectedId?: number;
  onStartDrag?: (pointId: number) => void;
  onEndDrag?: () => void;
  onMouseDown?: () => void;
  onMouseMove?: (pos: { x: number; y: number }) => void;
  onMouseLeave?: () => void;
}) => {
  const {
    data,
    onStartDrag,
    onEndDrag,
    onMouseMove,
    points,
    selectedId,
    onMouseLeave,
    onMouseDown,
  } = props;
  if (data === undefined) {
    return null;
  }
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const size = props.size || 128;
  const pointSize = size / 75;
  const [aspect, setAspect] = useState(1.0);
  let height = size;
  let width = size;
  if (aspect < 1.0) {
    width = size * aspect;
  } else {
    height = size * aspect;
  }
  useEffect(() => {
    const img = imgRef.current;
    const svg = svgRef.current;
    if (img === null || svg === null) {
      return;
    }
    img.src = `data:image;base64,${data}`;
    img.onload = () => {
      setAspect(img.height / img.width);
    };
  }, []);

  const handleMove = (e) => {
    if (onMouseMove === undefined) {
      return;
    }
    const svg = svgRef.current;
    if (svg === null) {
      return;
    }
    const { left, top } = svg.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - left;
    const y = clientY - top;
    onMouseMove({ x: x / width, y: y / height });
  };

  return (
    <div style={{ position: "relative", minHeight: height, minWidth: width }}>
      <img
        ref={imgRef}
        style={{ position: "absolute", width, height, userSelect: "none" }}
        height={height}
        width={width}
      />
      <svg
        ref={svgRef}
        style={{ position: "absolute", width, height, userSelect: "none" }}
        onMouseUp={(e) => onEndDrag && onEndDrag()}
        onMouseDown={(e) => onMouseDown && onMouseDown()}
        onMouseMove={handleMove}
        onMouseLeave={(e) => onEndDrag && onEndDrag()}
      >
        {points?.map((p, i) => (
          <circle
            key={i}
            cx={p.x * width}
            cy={p.y * height}
            r={pointSize}
            fill={selectedId === i ? "yellow" : "red"}
            onMouseDown={(e) => onStartDrag && onStartDrag(i)}
          />
        ))}
      </svg>
    </div>
  );
};
export default SvgCharPlot;
