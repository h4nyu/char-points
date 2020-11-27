import React from "react";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import PageLayout from "../components/PageLayout";
import store, { InputMode } from "../store";
import SvgCharPlot from "../components/SvgCharPlot";
import DeleteBtn from "../components/DeleteBtn";
import PointList from "../components/PointList";
import BoxList from "../components/BoxList"
import Upload from "../components/FileUpload";
import { RouteComponentProps } from "react-router";
import { useParams } from "react-router-dom";

const { editCharImage } = store;
const Content = observer(() => {
  const { points, 
    boxes,
    size, draggingId, imageData, 
    mode } = editCharImage.state;
  const {
    save,
    changeSize,
    add,
    toggleSelect,
    move,
    setMode,
    del,
  } = editCharImage;
  return (
    <>
      <button className="button" onClick={() => changeSize(size * 1.1)}>
        <i className="fas fa-plus" />
      </button>
      <button className="button" onClick={() => changeSize(size * 0.9)}>
        <i className="fas fa-minus" />
      </button>
      <div style={{ display: "flex" }}>
        <div>
          <SvgCharPlot
            data={imageData}
            points={points}
            mode={mode}
            boxes={boxes}
            selectedId={draggingId}
            onStartDrag={toggleSelect}
            onEndDrag={toggleSelect}
            onMouseMove={move}
            onMouseDown={add}
            size={size}
          />
        </div>

        <div  style={{height: size, width:"100%" }}>
          <div className="tabs is-boxed">
            <ul>
              <li className={mode === InputMode.Point && "is-active" || undefined}>
                <a onClick={() => setMode(InputMode.Point)}>Points</a>
              </li>
              <li className={mode === InputMode.Box && "is-active" || undefined}>
                <a onClick={() => setMode(InputMode.Box)}>Boxes</a>
              </li>
            </ul>
          </div>
          <div style={{ overflow: "scroll" }}>
            {
              mode === InputMode.Point && <PointList
                points={points}
                selectedId={draggingId}
                onHover={i => toggleSelect(i, InputMode.Point)}
                onCloseClick={del}
              />
            }
            {
              (mode === InputMode.Box 
              || mode === InputMode.TR
              || mode === InputMode.TL
              || mode === InputMode.BR
              || mode === InputMode.BL)
              && <BoxList
                boxes={boxes}
                selectedId={draggingId}
                onHover={(i) => toggleSelect(i, InputMode.Box)}
                onCloseClick={del}
              />
            }
          </div>
        </div>
      </div>

      <button className="button is-info is-light" onClick={save}>
        save
      </button>
    </>
  );
});

export default function EditChartImagePage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
