import React from "react";
import { Boxes, Box } from "../store";

export const BoxList = (props: {
  boxes: Boxes;
  selectedIds?: string[];
  onClick?: (id: string) => void;
}) => {
  const { boxes, selectedIds, onClick } = props;
  const Row = (b: Box, i: string) => {
    return (
      <tr
        key={i}
        className={selectedIds?.includes(i) ? "is-selected" : ""}
        onClick={() => onClick && onClick(i)}
      >
        <th>{b.x0.toFixed(3)}</th>
        <th>{b.y0.toFixed(3)}</th>
        <th>{b.x1.toFixed(3)}</th>
        <th>{b.y1.toFixed(3)}</th>
      </tr>
    );
  };
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th> x0 </th>
          <th> y0 </th>
          <th> x1 </th>
          <th> y1 </th>
        </tr>
      </thead>
      <tbody>{boxes.map(Row).toList()}</tbody>
    </table>
  );
};

export default BoxList;
