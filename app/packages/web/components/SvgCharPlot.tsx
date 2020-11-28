import React, { RefObject, useRef, useEffect, useState } from "react";
import { CharImage, Point, Box, InputMode } from "../store";

export const SvgCharPlot = (props: {
  data?: string;
  mode?: InputMode;
  points?: Point[];
  boxes?: Box[];
  size?: number;
  selectedId?: number;
  onStartDrag?: (id: number, InputMode:InputMode) => void;
  onEndDrag?: () => void;
  onMouseDown?: () => void;
  onMouseMove?: (pos: { x: number; y: number }) => void;
  onMouseLeave?: () => void;
}) => {
  const {
    data,
    mode,
    onStartDrag,
    onEndDrag,
    onMouseMove,
    points,
    boxes,
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
            fill={mode === InputMode.Point && selectedId === i ? "yellow" : "red"}
            onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.Point)}
          />
        ))}
        {boxes?.map((b, i) => (
          <g key={i}>
            <rect 
              x={b.x0 * width} 
              y={b.y0 * height} 
              width={(b.x1 - b.x0) * width}
              height={(b.y1 - b.y0) * height}
              fill='transparent'
              stroke={selectedId === i && mode === InputMode.Box  ? "yellow" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.Box)}
            />
            <circle
              cx={b.x0 * width}
              cy={b.y0 * height}
              r={pointSize/2}
              fill={selectedId === i && (mode === InputMode.Box || mode === InputMode.TL)  ? "yellow" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.TL)}
            />
            <circle
              cx={b.x1 * width}
              cy={b.y0 * height}
              r={pointSize/2}
              fill={selectedId === i && (mode === InputMode.Box || mode === InputMode.TR) ? "yellow" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.TR)}
            />
            <circle
              cx={b.x0 * width}
              cy={b.y1 * height}
              r={pointSize/2}
              fill={selectedId === i && (mode === InputMode.Box || mode === InputMode.BL) ? "yellow" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.BL)}
            />
            <circle
              cx={b.x1 * width}
              cy={b.y1 * height}
              r={pointSize/2}
              fill={selectedId === i && (mode === InputMode.Box || mode === InputMode.BR) ? "yellow" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.BR)}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
export default SvgCharPlot;
