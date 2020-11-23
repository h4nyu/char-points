import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store from "../store";
import SvgCharPlot from "../components/SvgCharPlot";
import DeleteBtn from "../components/DeleteBtn";
import PointList from "../components/PointList";
import Upload from "../components/FileUpload";
import { RouteComponentProps } from 'react-router';
import {
  useParams
} from "react-router-dom";

const { editCharImage } = store;
const Content = observer(() => {
  const { points, size, draggingId, imageData } = editCharImage.state;
  const {
    changeSize,
    addPoint,
    toggleSelect,
    movePoint,
    delPoint,
  } = editCharImage;
  return (
    <>
      <button className="button" onClick={() => changeSize(size * 1.1)}>
        <i className="fas fa-plus" />
      </button>
      <button className="button" onClick={() => changeSize(size * 0.9)}>
        <i className="fas fa-minus" />
      </button>
      <div style={{ display: "flex"}}>
        <div>
          <SvgCharPlot
            data={imageData}
            points={points}
            selectedId={draggingId}
            onStartDrag={toggleSelect}
            onEndDrag={toggleSelect}
            onMouseMove={movePoint}
            onMouseDown={addPoint}
            size={size}
          />
        </div>
        <div
          style={{height:size, overflow: "scroll" }}
        >
          <PointList
            points={points}
            selectedId={draggingId}
            onHover={toggleSelect}
            onCloseClick={delPoint}
          />
        </div>
      </div>
    </>
  );
});

export default function EditChartImagePage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
