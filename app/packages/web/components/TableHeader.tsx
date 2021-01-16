import React, { useState } from "react";
import styled from "styled-components";

export default function TableHeader(props: {
  columns: string[];
  sortColumns?: string[];
  sort?: [string, boolean];
  onChange?: (column: [string, boolean]) => void;
}) {
  const { columns, sortColumns, onChange, sort } = props;
  const [sortColumn, asc] = sort || ["", false];
  const handleSort = (value: string) => {
    onChange && onChange([value, !asc]);
  };
  const isSortable = (value: string) => {
    return sortColumns?.includes(value);
  };
  const mark = asc ? "🔽" : "🔼";
  return (
    <thead>
      <tr>
        {columns.map((x) => (
          <th
            style={{
              cursor: isSortable(x) ? "pointer" : "",
              whiteSpace: "nowrap",
            }}
            key={x}
            onClick={isSortable(x) ? () => handleSort(x) : () => null}
          >
            {x}
            {isSortable(x) && sortColumn === x && mark}
          </th>
        ))}
      </tr>
    </thead>
  );
}
