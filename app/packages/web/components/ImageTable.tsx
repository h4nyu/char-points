import React from "react";
import Tag from "@charpoints/web/components/Tag";
import { Image } from "@charpoints/core/image";
import { List } from "immutable";
import DateView from "@charpoints/web/components/DateView";
import TableHeader from "@charpoints/web/components/TableHeader";




const columns = [
  "Name",
  "State",
  "Box",
  "Point",
  "Score",
  "Create",
  "Update",
  "",
];

export const ImageTable = (props: {
  images: Image[];
  sortColumn: string;
  asc:boolean;
  onClick?: (imageId: string) => void;
  onDownload? : (imageId:string) => void;
  setSort:( column: string, asc:boolean ) => void
}) => {
  const { images, onClick, onDownload, asc, sortColumn, setSort } = props;
  let rows = List(images).map(x => {
    return {
      ...x,
      Name: x.name,
      State: x.state,
      Point: x.pointCount,
      Box: x.boxCount,
      Score: x.loss,
      Create:x.createdAt,
      Update:x.updatedAt,
      onClick: () => onClick && onClick(x.id),
      onDownload: () => onDownload && onDownload(x.id)
    }
  })

  return (
    <div style={{width:"100%"}}>
      <table className="table is-fullwidth">
        <TableHeader
          columns={columns}
          sortColumns={columns}
          onChange={e => setSort(...e)}
          sort={[sortColumn, asc]}
        />
        <tbody>
          {rows
            .map((x, i) => {
              return (
                <tr
                  key={i}
                >
                  <td> <a onClick={x.onDownload}>{x.Name}</a> </td>
                  <td><Tag value={x.State} /></td>
                  <td> {x.boxCount} </td>
                  <td> {x.pointCount} </td>
                  <td> {x.loss?.toFixed(3)}</td>
                  <td> <DateView value={x.createdAt} /> </td>
                  <td> <DateView value={x.updatedAt} /> </td>
                  <td> <a onClick={x.onClick} className="button is-small">Edit</a> </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default ImageTable;
