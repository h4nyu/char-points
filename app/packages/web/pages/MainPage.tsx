import React from "react";
import { Header } from "../components/Header";
import { observer } from "mobx-react-lite";
import { observable, makeObservable } from "mobx"
import { createContainer } from "unstated-next"
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";


type State = {
  count:number
}

const Store = (state:State) => {
  const countUp = () => {
    state.count = state.count + 1
  };
  setInterval(countUp, 1000)
  return {
    state,
    countUp: countUp,
  };
};

const store = Store(observable({count:0}));

const A = observer(() => {
  return <>
    <div>{ store.state.count } </div>
    <button onClick={() => store.countUp()}>aaaa</button>
  </>
});


export default function MainPage() {
  return (
    <>
      <Header />
      <A />
    </>
  );
}
