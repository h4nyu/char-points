import React from "react";
import { Header } from "../components/Header";
import { Observer } from "mobx-react-lite";
import store from "../store";
import ImageGrid from "../components/ImageGrid";
import Upload from "../components/FileUpload";

export default function MainPage() {
  return (
    <Observer>
      {() => (
        <>
          <Header />
          <Upload onChange={store.charImage.uploadFiles} />
          <ImageGrid
            charImages={store.data.state.charImages}
            onDeleteClick={store.charImage.delete}
          />
        </>
      )}
    </Observer>
  );
}
