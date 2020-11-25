import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store from "../store";
import { parseISO } from "date-fns";
import SvgCharPlot from "../components/SvgCharPlot";
import Upload from "../components/FileUpload";

const Content = observer(() => {
  const { history } = store;
  const { charImages, points } = store.data.state;
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
          .map(x => ({ charImage:x, points: points.filter(y => y.imageId ===x.id)}))
          .sortBy(x => -parseISO(x.charImage.createdAt))
          .sortBy(x => x.points.size)
          .map(x => (
            <div className="card m-1" key={x.charImage.id}>
              <div className="card-image">
                <SvgCharPlot data={x.charImage.data} points={x.points} size={128} />
              </div>
              <footer className="card-footer">
                <button
                  className="card-footer-item button"
                  onClick={() => init(x.charImage.id)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="card-footer-item button"
                  onClick={() => deleteChartImage(x.charImage.id)}
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
