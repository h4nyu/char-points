import React from "react";
import { Point } from "../store";

export const PointList = (props: {
  points: Point[];
  selectedId?: number;
  onHover?: (id: number) => void;
  onCloseClick?: (id: number) => void;
}) => {
  const { points, selectedId, onHover, onCloseClick } = props;
  return (
    <table className="table">
      <thead>
        <tr>
          <th> id </th>
          <th> x </th>
          <th> y </th>
          {onCloseClick && <th> </th>}
        </tr>
      </thead>
      <tbody>
        {points.map((p, i) => (
          <tr
            key={i}
            className={selectedId === i ? "is-selected" : ""}
            onMouseEnter={() => onHover && onHover(i)}
            onMouseLeave={() => onHover && onHover(i)}
          >
            <th>{i}</th>
            <th>{p.x.toFixed(3)}</th>
            <th>{p.y.toFixed(3)}</th>
            {onCloseClick && (
              <th>
                <a onClick={() => onCloseClick(i)} className="delete"></a>
              </th>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PointList;
