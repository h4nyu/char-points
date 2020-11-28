import React from "react";
import { Points, Box } from "../store";

export const BoxList = (props: {
  boxes: Box[];
  selectedId?: number;
  onMouseEnter?: (id: number) => void;
  onMouseLeave?: () => void;
  onCloseClick?: (id: number) => void;
}) => {
  const { boxes, selectedId, onMouseEnter, onMouseLeave, onCloseClick } = props;
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th> id </th>
          <th> x0 </th>
          <th> y0 </th>
          <th> x1 </th>
          <th> y1 </th>
          {onCloseClick && <th> </th>}
        </tr>
      </thead>
      <tbody>
        {boxes.map((b, i) => (
          <tr
            key={i}
            className={selectedId === i ? "is-selected" : ""}
            onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
            onMouseLeave={() => onMouseLeave && onMouseLeave()}
          >
            <th>{i}</th>
            <th>{b.x0.toFixed(3)}</th>
            <th>{b.y0.toFixed(3)}</th>
            <th>{b.x1.toFixed(3)}</th>
            <th>{b.y1.toFixed(3)}</th>
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

export default BoxList;
