import { v4 as uuidv4 } from "uuid";
import { CharPoint, PointType } from ".";

export default function wrap(arg?: CharPoint) {
  const point = arg || {
    id: uuidv4(),
    x: 0,
    y: 0,
    pointType: PointType.Start,
    imageId: "",
  };
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
  const setImageId = (v: string) => {
    return wrap({
      ...point,
      imageId: v,
    });
  };
  const setPointType = (v: PointType) => {
    return wrap({
      ...point,
      pointType: v,
    });
  };
  return {
    shift,
    setImageId,
    setPointType,
    unwrap,
  };
}
