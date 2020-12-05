import React from "react";
import Header from "../components/Header";
import Tag from "../components/Tag"
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import PageLayout from "../components/PageLayout";
import store from "../store";
import { List } from "immutable";
import { keyBy } from "lodash";
import { v4 as uuid } from "uuid";
import { parseISO } from "date-fns";
import SvgCharPlot from "../components/SvgCharPlot";
import Upload from "../components/FileUpload";

const Content = observer(() => {
  const { history } = store;
  const { charImages } = store.data.state;
  const { deleteChartImage } = store.data;
  const { init } = store.editCharImage;
  const { uploadFiles } = store.charImage;
  return (
    <>
      <Upload accept={"application/json, image/*"} onChange={uploadFiles} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          overflow: "auto",
        }}
      >
        {charImages
          .toList()
          .map((x) => {
            return {
              ...x,
              points: Map((x.points || []).map((x, i) => [`${i}`, x])),
              boxes: Map((x.boxes || []).map((x, i) => [`${i}`, x])),
            };
          })
          .sortBy((x) => -parseISO(x.createdAt))
          .sortBy((x) => x.points.size + x.boxes.size  )
          .map((x) => (
            <div 
              className="card m-1" 
              key={x.id}
              style={{cursor:"pointer"}}
              onClick={() => init(x.id)}
            >
              <div className="card-image"
              >
                <SvgCharPlot
                  data={x.data}
                  size={128}
                />
              </div>
              <footer className="card-footer">
                {x.points.size > 0 && <Tag value="Point"/>}
                {x.boxes.size > 0 && <Tag value="Box"/>}
              </footer>
            </div>
          ))}
      </div>
    </>
  );
});

export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
