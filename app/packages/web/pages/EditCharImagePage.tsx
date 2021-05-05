import React from "react";
import Header from "../components/Header";
import Tag from "../components/Tag";
import { observer } from "mobx-react-lite";
import { State as ImageState } from "@charpoints/core/image";

import PageLayout from "../components/PageLayout";
import store, { InputMode } from "../store";
import SvgCharPlot from "../components/SvgCharPlot";
import DeleteBtn from "../components/DeleteBtn";
import PointList from "../components/PointList";
import BoxList from "../components/BoxList";
import Upload from "../components/FileUpload";
import { RouteComponentProps } from "react-router";
import { useParams, useHistory } from "react-router-dom";

const { editor, data } = store;
const Content = observer(() => {
  const {
    id,
    labels,
    points,
    boxes,
    predictedBoxes,
    size,
    draggingId,
    imageData,
    mode,
    weight,
  } = editor.state;
  const {
    init,
    save,
    setLabel,
    changeSize,
    addLabel,
    add,
    toggleDrag,
    move,
    setMode,
    del,
    clear,
  } = editor;
  const { next, prev } = data;
  const history = useHistory();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr 50px",
        gridTemplateColumns: "auto 1fr auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          gridRow: "1",
          gridColumn: "1",
        }}
        className="field p-1"
      >
        <label className="label">
          {editor.state.loss && (
            <span className="tag is-light">{editor.state.loss}</span>
          )}
          <span>{editor.state.id}</span>
        </label>
      </div>

      <div
        style={{
          gridRow: "2",
          gridColumn: "3",
        }}
      >
      </div>

      <div
        style={{
          display: "flex",
          gridRow: "2",
          gridColumn: "1 / span 3",
          overflow: "scroll",
        }}
        className={"card"}
        onKeyDown={(e) => {
          const { keyCode } = e;
          if (keyCode === 8) {
            del();
          }
        }}
        tabIndex={0}
      >
        <SvgCharPlot
          data={imageData}
          points={points}
          predictedBoxes={predictedBoxes}
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
          gridColumn: "3",
          gridRow: "1",
        }}
      >
      </div>
      <div
        className="buttons"
        style={{
          gridRow: "3",
          gridColumn: "1",
        }}
      >
        <button
          className="button is-light"
          onClick={() => {
            init(prev() || "");
          }}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <button
          className="button is-light"
          onClick={() => {
            init(next() || "");
          }}
        >
          <i className="fas fa-arrow-right"></i>
        </button>

        <button
          className="button is-light"
          onClick={() => changeSize(size * 1.1)}
        >
          <i className="fas fa-plus" />
        </button>
        <button
          className="button is-light"
          onClick={() => changeSize(size * 0.9)}
        >
          <i className="fas fa-minus" />
        </button>
        <button
          className={"button is-light ".concat(
            (mode === InputMode.Point && "is-warning") || ""
          )}
          onClick={() => setMode(InputMode.Point)}
        >
          Point
        </button>
        <button
          className={"button is-light ".concat(
            ([
              InputMode.Box,
              InputMode.TR,
              InputMode.TR,
              InputMode.BR,
              InputMode.BL,
            ].includes(mode) &&
              "is-warning") ||
              ""
          )}
          onClick={() => setMode(InputMode.Box)}
        >
          Box
        </button>
        <button className="button is-danger is-light" onClick={clear}>
          Reset
        </button>
      </div>

      <div
        className="buttons"
        style={{
          gridRow: "3",
          gridColumn: "3",
        }}
      >
        <button
          className="button is-info is-light"
          onClick={() => save()}
        >
          Save
        </button>
        <button
          className="button is-danger is-light"
          onClick={() => editor.delete()}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default function EditChartImagePage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
