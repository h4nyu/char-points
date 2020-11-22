import React, {RefObject, useRef, useEffect, useState} from 'react';
import { CharImage, Point } from "@charpoints/core/charImage";

export const SvgCharPlot = (props:{
  data?: string,
  points?: Point[],
  size?: number,
  onStartDrag?: (pointId: number) => void
  onEndDrag?: () => void
  onMouseMove?: (pos:{x:number, y:number}) => void
}) => {
  const {data, onStartDrag, onEndDrag, onMouseMove, points} = props;
  if(data === undefined) {
    return null;
  }

  const imgRef: RefObject<HTMLImageElement> = useRef(null);
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const size = props.size || 128
  const [scale, setScale] = useState(1.0)

  useEffect(() => {
    const img = imgRef.current
    const svg = svgRef.current
    if(img === null || svg === null ) {return}
    img.src = `data:image;base64,${data}`
    img.onload = () => {
      const maxLength = Math.max(img.width, img.height);
      const s = size / maxLength
      const height = img.height * s
      const width = img.width * s;
      img.height = height
      img.width = width
      svg.style.height = `${height}`
      svg.style.width = `${width}`
      setScale(s)
    }
  }, [])
  const handleMove = (e) => {
    if(onMouseMove === undefined){ return }
    const svg = svgRef.current
    if(svg === null) {return}
    const {left, top} = svg.getBoundingClientRect();
    const { clientX, clientY } = e
    const x = clientX - left
    const y = clientY - top
    onMouseMove({x: x / scale, y: y / scale})
  }
  return <div> 
    <img ref={imgRef} style={{position:'absolute'}}/>
    <svg ref={svgRef} style={{position:'absolute'}} 
      onMouseUp={e => onEndDrag && onEndDrag()}
      onMouseMove={handleMove}
    >
      {
        points?.map((p, i) => 
          <circle 
            key={i}
            cx={p.x * scale} 
            cy={p.y * scale} 
            r={scale * 1.5}
            fill="red" 
            onMouseDown={e => onStartDrag && onStartDrag(i)}
            />)
      }

    </svg>
  </div>;
}
export default SvgCharPlot
