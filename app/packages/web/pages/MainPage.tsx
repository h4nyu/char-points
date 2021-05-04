import React, { useState } from "react";
import Header from "../components/Header";
import { State as ImageState } from "@charpoints/core/image";
import ImageTable from "@charpoints/web/components/ImageTable";
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
  const { images, tag, cursor } = store.data.state;
  const { init } = store.editor;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr 110px",
        gridTemplateColumns: "1fr auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          gridRow: "1",
          gridColumn: "1",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <input
          className="input"
          type="text"
          value={store.data.state.keyword}
          onChange={(e) => store.data.setKeyword(e.target.value)}
        />
      </div>
      <div
        style={{
          gridRow: "1",
          gridColumn: "2",
        }}
      >
        <button
          className={"button is-light is-danger"}
          onClick={() => fetchImages()}
        >
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
        <ImageTable
          sortColumn={store.data.state.sortColumn}
          asc={store.data.state.asc}
          images={images.toList().toJS()}
          setSort={store.data.setSort}
          onClick={init}
          onDownload={store.data.download}
        />
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
