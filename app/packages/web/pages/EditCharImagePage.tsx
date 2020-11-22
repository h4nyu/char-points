import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store from "../store";
import ImageGrid from "../components/ImageGrid";
import SvgCharPlot from "../components/SvgCharPlot";
import DeleteBtn from "../components/DeleteBtn";
import Upload from "../components/FileUpload";
const Content = observer(() => {
  const {editCharImage} = store;
  return <>
    <SvgCharPlot 
      data={editCharImage.state.imageData}
      points={editCharImage.state.points}
      onStartDrag={editCharImage.startDrag}
      onEndDrag={editCharImage.endDrag}
      onMouseMove={editCharImage.movePoint}
      size={512}
    />
  </>
})

export default function EditChartImagePage() {
  return <PageLayout
    header={<Header />}
    content={<Content/> }
  />;
}
