import React, { useState } from "react";
import Header from "../components/Header";
import Tag from "../components/Tag";
import { State as ImageState } from "@charpoints/core/charImage";
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
  const { updateFilter, fetchImages, next } = store.data;
  const { images, isPoint, isBox, tag, cursor } = store.data.state;
  const { init } = store.editor;
  const rows = images;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 1fr 110px",
        gridTemplateColumns: "1fr auto",
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
        <button
          className={"button is-light".concat(
            (tag === ImageState.Todo && " is-info") || ""
          )}
          onClick={() => updateFilter({ tag: ImageState.Todo })}
        >
          Todo
        </button>
        <button
          className={"button is-light".concat(
            (tag === ImageState.Done && " is-info") || ""
          )}
          onClick={() => updateFilter({ tag: ImageState.Done })}
        >
          Done
        </button>
        <button
          className={"button is-light".concat((isPoint && " is-warning") || "")}
          onClick={() => updateFilter({ isPoint: !isPoint })}
        >
          Point
        </button>
        <button
          className={"button is-light".concat((isBox && " is-warning") || "")}
          onClick={() => updateFilter({ isBox: !isBox })}
        >
          Box
        </button>
      </div>
      <div
        style={{
          gridRow: "1",
          gridColumn: "2",
        }}
      >
        <button className={"button is-light"} onClick={() => fetchImages()}>
          Search
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
          gridRow: "2",
          gridColumn: "1 / span 2",
          overflow: "scroll",
        }}
      >
        {rows.map((x, i) => (
          <div
            className="card m-1"
            key={i}
            style={{
              cursor: "pointer",
              position: "relative",
              width: 128,
              height: 128,
            }}
            onClick={() => init(x.id)}
          >
            <div style={{ position: "absolute" }}>
              <SvgCharPlot data={x.data} size={128} />
            </div>
            <div style={{ position: "absolute" }}>
              {x.hasPoint && <Tag value="Point" />}
              {x.hasBox && <Tag value="Box" />}
              {x.state && <Tag value={x.state} />}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          gridRow: "3",
          gridColumn: "1 / span 2",
        }}
      >
        <Upload
          accept={"application/json, image/*"}
          onChange={store.data.uploadFiles}
        />
      </div>
    </div>
  );
});

export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
