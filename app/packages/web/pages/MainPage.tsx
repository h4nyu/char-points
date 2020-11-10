import React from "react";
import { Header } from "../components/Header";
import { Observer } from "mobx-react-lite";
import store from "../store";
import ImageGrid from "../components/ImageGrid";
import Upload from "../components/FileUpload";
const { dataStore, charImageStore } = store;

export default function MainPage() {
  return (
    <Observer>
      {() => (
        <>
          <Header />
          <Upload onChange={charImageStore.uploadFiles} />
          <ImageGrid
            charImages={dataStore.state.charImages}
            onDeleteClick={charImageStore.delete}
          />
        </>
      )}
    </Observer>
  );
}
