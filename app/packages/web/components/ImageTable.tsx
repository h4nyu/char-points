import React from "react";
import Tag from "@charpoints/web/components/Tag";
import { Image } from "@charpoints/core/image";
import { List } from "immutable";
import DateView from "@charpoints/web/components/DateView";
import TableHeader from "@charpoints/web/components/TableHeader";




const columns = [
  "Id",
  "State",
  "Box",
  "Point",
  "Score",
  "Create",
  "Update",
  "",
];

const filterColumns = [
  "Id",
  "State",
];

export const ImageTable = (props: {
  images: Image[];
  keyword: string;
  setKeyword: (value: string) => void;
  onClick?: (imageId: string) => void;
  onDownload? : (imageId:string) => void;
}) => {
  const { images, onClick, keyword, setKeyword, onDownload } = props;
  const [sort, setSort] = React.useState<[string, boolean]>(["Id", true]);
  const [sortColumn, asc] = sort;
  const lowerKeyowerd = keyword.toLowerCase();
  let rows = List(images).map(x => {
    return {
      ...x,
      Id: x.id,
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
  .filter(x =>  filterColumns
      .map((c) => x[c])
      .join(" ")
      .toLowerCase()
      .includes(lowerKeyowerd)
   )
   .sortBy((x) => x[sortColumn]);
   if (asc) {
     rows = rows.reverse();
   }

  return (
    <div style={{width:"100%"}}>
      <input
        className="input"
        type="text"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <table className="table is-fullwidth">
        <TableHeader
          columns={columns}
          sortColumns={columns}
          onChange={setSort}
          sort={sort}
        />
        <tbody>
          {rows
            .map((x, i) => {
              return (
                <tr
                  key={i}
                  style={{ cursor: onClick ? "pointer" : "" }}
                >
                  <td> <a onClick={x.onClick}> {x.id} </a> </td>
                  <td><Tag value={x.State} /></td>
                  <td> {x.boxCount} </td>
                  <td> {x.pointCount} </td>
                  <td> {x.loss?.toFixed(3)}</td>
                  <td> <DateView value={x.createdAt} /> </td>
                  <td> <DateView value={x.updatedAt} /> </td>
                  <td> <a onClick={x.onDownload}>Download</a> </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default ImageTable;
