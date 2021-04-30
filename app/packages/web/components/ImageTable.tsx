import React from "react";
import Tag from "@charpoints/web/components/Tag";
import { Image } from "@charpoints/core/image";
import { List } from "immutable";
import DateView from "@charpoints/web/components/DateView";
import TableHeader from "@charpoints/web/components/TableHeader";

const columns = [
  "Id",
  "Name",
  "State",
  "Box",
  "Point",
  "Score",
  "Create",
  "Update",
  "",
  "",
];

export const ImageTable = (props: {
  images: Image[];
  sortColumn: string;
  asc: boolean;
  onClick?: (imageId: string) => void;
  onDownload?: (imageId: string) => void;
  setSort: (column: string, asc: boolean) => void;
}) => {
  const { images, onClick, onDownload, asc, sortColumn, setSort } = props;
  const rows = List(images).map((x) => {
    return {
      ...x,
      Id: x.id,
      Name: x.name,
      Create: x.createdAt,
      Update: x.updatedAt,
      onClick: () => onClick && onClick(x.id),
      onDownload: () => onDownload && onDownload(x.id),
    };
  });

  return (
    <div style={{ width: "100%" }}>
      <table className="table is-fullwidth">
        <TableHeader
          columns={columns}
          sortColumns={columns}
          onChange={(e) => setSort(...e)}
          sort={[sortColumn, asc]}
        />
        <tbody>
          {rows.map((x, i) => {
            return (
              <tr key={i}>
                <td> {x.Id} </td>
                <td> {x.Name}</td>
                <td>
                </td>
                <td>
                  {" "}
                  <DateView value={x.createdAt} />{" "}
                </td>
                <td>
                  {" "}
                  <DateView value={x.updatedAt} />{" "}
                </td>
                <td>
                  {" "}
                  <a onClick={x.onClick} className="button is-small">
                    Edit
                  </a>{" "}
                </td>
                <td>
                  {" "}
                  <a onClick={x.onDownload} className="button is-small">
                    Download
                  </a>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ImageTable;
