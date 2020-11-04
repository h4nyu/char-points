import React from "react";
import { Header } from "../components/Header";
import { observer } from "mobx-react-lite";
import store from "../store";
const { dataStore } = store;

const A = observer(() => {
  const { charImages } = dataStore.state;
  return (
    <>
      {charImages.map((x) => (
        <div>aaa</div>
      ))}
    </>
  );
});

export default function MainPage() {
  return (
    <>
      <Header />
      <A />
    </>
  );
}
