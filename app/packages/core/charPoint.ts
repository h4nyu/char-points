import { v4 as uuidv4 } from "uuid";
import { CharPoint, PointType } from ".";

export function wrap(point: CharPoint) {
  const shift = (diff: { x: number; y: number }) => {
    return wrap({
      ...point,
      x: point.x + diff.x,
      y: point.y + diff.y,
    });
  };
  const unwrap = () => {
    return point;
  };
  return {
    shift,
    unwrap,
  };
}

export default function (): CharPoint {
  return {
    id: uuidv4(),
    x: 0,
    y: 0,
    pointType: PointType.Start,
    imageId: "",
  };
}
