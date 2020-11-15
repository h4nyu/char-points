import React from "react";
import Header from "../components/Header";
import { Observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout"
import store from "../store";
import ImageGrid from "../components/ImageGrid";
import DeleteBtn from "../components/DeleteBtn";
import Upload from "../components/FileUpload";

export default function MainPage() {
  const { data } = store;
  return (
    <Observer>
      {() => (
        <PageLayout
          header={<Header/>}
          content={
            <div style={{height: "100%"}}>
              <div className="buttons">
                <Upload onChange={store.charImage.uploadFiles} />
                <DeleteBtn />
              </div>
              <ImageGrid charImages={data.state.charImages} />
            </div>
          }
        />
      )}
    </Observer>
  );
}
