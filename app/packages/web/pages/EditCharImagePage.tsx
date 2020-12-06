import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store, { InputMode } from "../store";
import SvgCharPlot from "../components/SvgCharPlot";
import DeleteBtn from "../components/DeleteBtn";
import PointList from "../components/PointList";
import BoxList from "../components/BoxList";
import Upload from "../components/FileUpload";
import { RouteComponentProps } from "react-router";
import { useParams, useHistory } from "react-router-dom";

const { editCharImage } = store;
const Content = observer(() => {
  const {
    id,
    points,
    boxes,
    size,
    draggingId,
    imageData,
    mode,
  } = editCharImage.state;
  const {
    save,
    changeSize,
    add,
    toggleDrag,
    move,
    setMode,
    detectBoxes,
    del,
  } = editCharImage;
  const { deleteChartImage } = store.data;
  const history = useHistory();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 1fr 50px",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="buttons"
        style={{
          gridRow: "1",
          gridColumn: "1",
        }}
      >
        <button className="button" onClick={() => changeSize(size * 1.1)}>
          <i className="fas fa-plus" />
        </button>
        <button className="button" onClick={() => changeSize(size * 0.9)}>
          <i className="fas fa-minus" />
        </button>
        <button className="button" onClick={detectBoxes}>
          文字検出
        </button>
      </div>

      <div
        className={"card"}
        onKeyDown={(e) => {
          const { keyCode } = e;
          if (keyCode === 8) {
            del();
          }
        }}
        style={{
          display: "flex",
          gridRow: "2",
          gridColumn: "1 / span 2",
          overflow: "scroll",
        }}
        tabIndex={0}
      >
        <SvgCharPlot
          data={imageData}
          points={points}
          mode={mode}
          boxes={boxes}
          selectedId={draggingId}
          onMove={move}
          onAdd={add}
          onSelect={toggleDrag}
          onLeave={del}
          size={size}
        />
      </div>

      <div
        style={{
          gridColumn: "2",
          gridRow: "1",
        }}
      >
        <div className="tabs is-toggle">
          <ul>
            <li
              className={(mode === InputMode.Point && "is-active") || undefined}
            >
              <a onClick={() => setMode(InputMode.Point)}>Points</a>
            </li>
            <li
              className={
                ([
                  InputMode.Box,
                  InputMode.TR,
                  InputMode.TR,
                  InputMode.BR,
                  InputMode.BL,
                ].includes(mode) &&
                  "is-active") ||
                undefined
              }
            >
              <a onClick={() => setMode(InputMode.Box)}>Boxes</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="buttons"
        style={{
          gridRow: "3",
          gridColumn: "1",
        }}
      >
        <button className="button is-info is-light" onClick={save}>
          save
        </button>
        <button
          className="button is-danger is-light"
          onClick={() => {
            deleteChartImage(id);
            history.goBack();
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
});

export default function EditChartImagePage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
