import React from "react";
import { Point } from "../store";

export const PointList = (props: {
  points: Point[];
  selectedId?: number;
  onMouseEnter?: (id: number) => void;
  onMouseLeave?: () => void;
  onCloseClick?: (id: number) => void;
}) => {
  const { points, selectedId, onMouseEnter, onMouseLeave, onCloseClick } = props;
  return (
    <table className="table is-fullwidth">
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
            onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
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
