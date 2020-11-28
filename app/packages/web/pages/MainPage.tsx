import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store from "../store";
import { List } from "immutable";
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
          .sortBy(x => -parseISO(x.createdAt))
          .sortBy(x => x.points?.length)
          .map(x => (
            <div className="card m-1" key={x.id}>
              <div className="card-image">
                <SvgCharPlot data={x.data} points={x.points} boxes={x.boxes} size={128} />
              </div>
              <footer className="card-footer">
                <button
                  className="card-footer-item button"
                  onClick={() => init(x.id)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="card-footer-item button"
                  onClick={() => deleteChartImage(x.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
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
