import React from "react";
import { Header } from "../components/Header";
import { Observer } from "mobx-react-lite";
import store from "../store";
import ImageGrid from "../components/ImageGrid";
import DeleteBtn from "../components/DeleteBtn";
import Upload from "../components/FileUpload";

export default function MainPage() {
  return (
    <Observer>
      {() => (
        <>
          <Header />
          <div className="buttons">
            <Upload onChange={store.charImage.uploadFiles} />
            <DeleteBtn />
          </div>
          <ImageGrid charImages={store.data.state.charImages} />
        </>
      )}
    </Observer>
  );
}
