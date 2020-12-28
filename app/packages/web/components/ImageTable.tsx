import React from 'react';
import Tag from "@charpoints/web/components/Tag";
import { Image } from '@charpoints/core/image';


export const ImageTable = (props:{
  images: Image[],
  onClick?: (imageId:string) => void
}) => {
  const {images, onClick} = props
  return  <table className="table is-fullwidth"> 
    <thead>
      <tr>
        <th>id</th>
        <th>Box</th>
        <th>Point</th>
        <th>State</th>
        <th>Create</th>
      </tr>
    </thead>
    <tbody >
      {
        images.map((x, i) => {
          return (
            <tr key={i} onClick={() => onClick && onClick(x.id)}
              style={{cursor: onClick ? 'pointer' : ""}}
            >
              <td> {x.id} </td>
              <td> { x.boxes?.length || 0 } </td>
              <td> { x.points?.length || 0 } </td>
              <td> <Tag value={x.state}/> </td>
              <td> {x.createdAt} </td>
            </tr>
          )
        })
      }
    </tbody>
  </table>
}
export default ImageTable

