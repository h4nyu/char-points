import React from "react";
import { Points } from "../store";

export const PointList = (props: {
  points: Points;
  selectedIds?: string[];
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
  onCloseClick?: (id: string) => void;
}) => {
  const { points, selectedIds, onMouseEnter, onMouseLeave, onCloseClick } = props;
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th> x </th>
          <th> y </th>
          {onCloseClick && <th> </th>}
        </tr>
      </thead>
      <tbody>
        {points.map((p, i) => (
          <tr
            key={i}
            className={selectedIds?.includes(i) ? "is-selected" : ""}
            onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
          >
            <th>{p.x.toFixed(3)}</th>
            <th>{p.y.toFixed(3)}</th>
            {onCloseClick && (
              <th>
                <a onClick={() => onCloseClick(i)} className="delete"></a>
              </th>
            )}
          </tr>
        )).toList()}
      </tbody>
    </table>
  );
};

export default PointList;
