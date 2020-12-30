import React from "react";
import Tag from "@charpoints/web/components/Tag";
import { Image } from "@charpoints/core/image";
import DateView from "@charpoints/web/components/DateView";

export const ImageTable = (props: {
  images: Image[];
  onClick?: (imageId: string) => void;
}) => {
  const { images, onClick } = props;
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>id</th>
          <th>State</th>
          <th>Create</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        {images.map((x, i) => {
          return (
            <tr
              key={i}
              onClick={() => onClick && onClick(x.id)}
              style={{ cursor: onClick ? "pointer" : "" }}
            >
              <td> {x.id} </td>
              <td>
                <Tag value={x.state} />
              </td>
              <td> <DateView  value={x.createdAt}/> </td>
              <td> <DateView  value={x.updatedAt}/> </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default ImageTable;
