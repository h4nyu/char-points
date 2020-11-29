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
    size, 
    draggingId, 
    imageData, 
    mode 
  } = editCharImage.state;
  const {
    save,
    changeSize,
    add,
    select,
    unselect,
    move,
    setMode,
    detectBoxes,
    del,
  } = editCharImage;
  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <button className="button" onClick={() => changeSize(size * 1.1)}>
            <i className="fas fa-plus" />
          </button>
          <button className="button" onClick={() => changeSize(size * 0.9)}>
            <i className="fas fa-minus" />
          </button>
          <button className="button" onClick={detectBoxes}>
            <i className="fas fa-minus" />
          </button>
          <SvgCharPlot
            data={imageData}
            points={points}
            mode={mode}
            boxes={boxes}
            selectedId={draggingId}
            onStartDrag={select}
            onEndDrag={unselect}
            onMouseMove={move}
            onMouseDown={add}
            size={size}
          />
        </div>
        <div style={{height: size }}>
          <div className="tabs is-boxed">
            <ul>
              <li className={mode === InputMode.Point && "is-active" || undefined}>
                <a onClick={() => setMode(InputMode.Point)}>Points</a>
              </li>
              <li className={[InputMode.Box, InputMode.TR, InputMode.TR, InputMode.BR, InputMode.BL,].includes(mode) && "is-active" || undefined}>
                <a onClick={() => setMode(InputMode.Box)}>Boxes</a>
              </li>
            </ul>
          </div>
          <div style={{ overflow: "scroll", maxHeight:size - 42 - 24 }}>
            {
              mode === InputMode.Point && <PointList
                points={points}
                selectedId={draggingId}
                onMouseLeave={unselect}
                onMouseEnter={i => select(i, InputMode.Point)}
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
                onMouseLeave={unselect}
                onMouseEnter={i => select(i, InputMode.Box)}
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
