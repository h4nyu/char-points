import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store from "../store";
import SvgCharPlot from "../components/SvgCharPlot";
import Upload from "../components/FileUpload";

const Content = observer(() => {
  const { history } = store;
  const { charImages } = store.data.state;
  const { init } = store.editCharImage;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "auto",
      }}
    >
      {charImages
        .toList()
        .sortBy((x) => x.points?.length)
        .reverse()
        .map((x) => (
          <div
            className="card m-1"
            key={x.id}
          >
            <div className="card-image">
              <SvgCharPlot data={x.data} points={x.points} size={128} />
            </div>
            <footer className="card-footer">
              <button className="card-footer-item button" onClick={() => init(x.id)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="card-footer-item button">
                <i className="fas fa-trash"></i>
              </button>
            </footer>
          </div>
        ))}
    </div>
  );
});


export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
