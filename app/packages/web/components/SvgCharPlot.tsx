import React, { RefObject, useRef, useEffect, useState } from "react";
import { CharImage, Points, Boxes, InputMode } from "../store";

export const SvgCharPlot = (props: {
  data?: string;
  mode?: InputMode;
  points?: Points;
  boxes?: Boxes;
  size?: number;
  selectedId?: string;
  onAdd?: () => void;
  onMove?: (pos: { x: number; y: number }) => void;
  onSelect?: (id: string, InputMode: InputMode) => void;
  onLeave?: () => void
}) => {
  const {
    data,
    mode,
    onAdd,
    onMove,
    selectedId,
    points,
    boxes,
    onSelect,
    onLeave,
  } = props;
  if (data === undefined) {
    return null;
  }
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const size = props.size || 128;
  const pointSize = 3;
  const [aspect, setAspect] = useState(1.0);
  let height = size;
  let width = size;
  if (aspect < 1.0) {
    height = size * aspect;
  } else {
    width = size / aspect;
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
  }, [data]);

  const handleMove = (e) => {
    if (onMove === undefined) {
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
    onMove({ x: x / width, y: y / height });
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: size,
        minWidth: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        ref={imgRef}
        style={{ position: "absolute", userSelect: "none" }}
        height={height}
        width={width}
      />
      <svg
        ref={svgRef}
        style={{ position: "absolute", width, height, userSelect: "none" }}
        onMouseMove={handleMove}
        onMouseLeave={onLeave}
        onClick={(e) => {  
          onAdd && onAdd()
        }}
      >
        {points
          ?.map((p, i) => (
            <circle
              key={i}
              cx={p.x * width}
              cy={p.y * height}
              r={pointSize}
              stroke="none"
              fill={
                mode === InputMode.Point && selectedId === i
                  ? "green"
                  : "red"
              }
              onClick={(e) =>{
                e.stopPropagation(); 
                onSelect && onSelect(i, InputMode.Point)
              }}
            />
          ))
          .toList()}
        {boxes
          ?.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x0 * width}
                y={b.y0 * height}
                width={(b.x1 - b.x0) * width || (2 / width)}
                height={(b.y1 - b.y0) * height ||  (2 / height)}
                fill="none"
                stroke={selectedId === i ? "green" : "red"}
                strokeWidth={pointSize / 2}
                onClick={(e) =>{
                  e.stopPropagation(); 
                  onSelect && onSelect(i, InputMode.Box)
                }}
              />
              <circle
                cx={b.x0 * width}
                cy={b.y0 * height}
                r={pointSize}
                stroke="none"
                fill={selectedId === i ? "green" : "red"}
                onClick={(e) => {
                  e.stopPropagation(); 
                  onSelect && onSelect(i, InputMode.TL)
                }}
              />
              <circle
                cx={b.x1 * width}
                cy={b.y0 * height}
                r={pointSize}
                fill={selectedId === i ? "green" : "red"}
                stroke="none"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onSelect && onSelect(i, InputMode.TR)
                }}
              />
              <circle
                cx={b.x0 * width}
                cy={b.y1 * height}
                r={pointSize}
                fill={selectedId === i ? "green" : "red"}
                stroke="none"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onSelect && onSelect(i, InputMode.BL)
                }}
              />
              <circle
                cx={b.x1 * width}
                cy={b.y1 * height}
                r={pointSize}
                stroke="none"
                fill={selectedId === i ? "green" : "red"}
                onClick={(e) => {
                  onSelect && onSelect(i, InputMode.BR)
                  e.stopPropagation(); 
                }}
              />
            </g>
          ))
          .toList()}
      </svg>
    </div>
  );
};
export default SvgCharPlot;
