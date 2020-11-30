import React, { RefObject, useRef, useEffect, useState } from "react";
import { CharImage, Points, Boxes, InputMode } from "../store";

export const SvgCharPlot = (props: {
  data?: string;
  mode?: InputMode;
  points?: Points;
  boxes?: Boxes;
  size?: number;
  selectedIds?: string[];
  onStartDrag?: (id: string, InputMode:InputMode) => void;
  onEndDrag?: () => void;
  onMouseDown?: () => void;
  onMouseMove?: (pos: { x: number; y: number }) => void;
  onClick?: (id: string, InputMode:InputMode) => void;
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
    selectedIds,
    onMouseLeave,
    onMouseDown,
    onClick,
  } = props;
  if (data === undefined) {
    return null;
  }
  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const size = props.size || 128;
  const pointSize = size / 100;
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
        style={{ position: "absolute", userSelect: "none" }}
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
            fill={mode === InputMode.Point && selectedIds?.includes(i) ? "green" : "red"}
            onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.Point)}
            onClick={e => onClick && onClick(i, InputMode.Point)}
          />
        ))}
        {boxes?.map((b, i) => (
          <g key={i}>
            <rect 
              x={b.x0 * width} 
              y={b.y0 * height} 
              width={(b.x1 - b.x0) * width}
              height={(b.y1 - b.y0) * height}
              fill={ "green" }
              stroke={selectedIds?.includes(i) ? "green" : "red"}
              fillOpacity={selectedIds?.includes(i) ? 0.3 : 0.0 }
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.Box)}
              onClick={e => onClick && onClick(i, InputMode.Box)}
            />
            <circle
              cx={b.x0 * width}
              cy={b.y0 * height}
              r={pointSize/2}
              fill={selectedIds?.includes(i) && (mode === InputMode.Box || mode === InputMode.TL)  ? "green" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.TL)}
            />
            <circle
              cx={b.x1 * width}
              cy={b.y0 * height}
              r={pointSize/2}
              fill={selectedIds?.includes(i) && (mode === InputMode.Box || mode === InputMode.TL)  ? "green" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.TR)}
            />
            <circle
              cx={b.x0 * width}
              cy={b.y1 * height}
              r={pointSize/2}
              fill={selectedIds?.includes(i) && (mode === InputMode.Box || mode === InputMode.TL)  ? "green" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.BL)}
            />
            <circle
              cx={b.x1 * width}
              cy={b.y1 * height}
              r={pointSize/2}
              fill={selectedIds?.includes(i) && (mode === InputMode.Box || mode === InputMode.TL)  ? "green" : "red"}
              onMouseDown={(e) => onStartDrag && onStartDrag(i, InputMode.BR)}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};
export default SvgCharPlot;
