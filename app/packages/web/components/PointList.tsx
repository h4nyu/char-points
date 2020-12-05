import React from "react";
import { Points } from "../store";

export const PointList = (props: {
  points: Points;
  selectedId?: string;
  onClick?: (id: string) => void;
}) => {
  const { points, selectedId, onClick } = props;
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th> x </th>
          <th> y </th>
        </tr>
      </thead>
      <tbody>
        {points
          .map((p, i) => (
            <tr
              key={i}
              className={selectedId === i ? "is-selected" : ""}
              onClick={() => onClick && onClick(i)}
            >
              <th>{p.x.toFixed(3)}</th>
              <th>{p.y.toFixed(3)}</th>
            </tr>
          ))
          .toList()}
      </tbody>
    </table>
  );
};

export default PointList;
