import React, { useState } from "react";
import Header from "../components/Header";
import Tag from "../components/Tag";
import { State } from "@charpoints/core/charImage";
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
  const { history, board } = store;
  const { setState } = board;
  const { hasPoint, hasBox, state } = board.state
  const { charImages } = store.data.state;
  const { init } = store.editor;
  const { uploadFiles } = store.charImage;
  const rows = charImages
    .toList()
    .filter((x) => {
      console.log(x.state)
      console.log(state)
      console.log(
        x.state === state , x.hasPoint === hasPoint , x.hasBox === hasBox
      )
      return x.state === state || x.hasPoint === hasPoint || x.hasBox === hasBox 
    })
    .sortBy((x) => -parseISO(x.createdAt));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "50px 1fr 110px",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
          gridRow: "2",
          overflow: "scroll",
        }}
      >
        {rows.map((x) => (
          <div
            className="card m-1"
            key={x.id}
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
          gridRow: "1",
        }}
      >
        <div className="tabs is-boxed">
          <ul>
            <li className={state === State.Todo && "is-active" || ""} onClick={() => setState(State.Todo)}>
              <a> Todo </a>
            </li>
            <li className={state === State.Done && "is-active" || ""} onClick={() => setState(State.Done)}>
              <a> Done </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ gridRow: "3" }}>
        <Upload accept={"application/json, image/*"} onChange={uploadFiles} />
      </div>
    </div>
  );
});

export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
